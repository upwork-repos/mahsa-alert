import { collection, getDocs, onSnapshot } from "firebase/firestore";
import {
	createContext,
	type Dispatch,
	type SetStateAction,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import { db } from "@/firebase";
import type { Strike } from "@/types/schema";
import { type Layer, type layerIds, totalLayers } from "./layers";
import { LayersDataRefProvider } from "./layers.context.ref";
import type { LayersData } from "./layers.context.types";
import { getFetchLayerDataPromise, initialLayersData } from "./layers.utils";

interface LayersContextType {
	layers: Layer[];
	setLayers: Dispatch<SetStateAction<Layer[]>>;
	toggleLayerVisibility: (
		layerId: keyof typeof layerIds,
		visible: boolean,
	) => void;
	layersData: LayersData;
	setLayersData: (layersData: LayersData) => void;
	isLayersDataLoaded: boolean;
}

const LayersContext = createContext<LayersContextType>({
	layers: totalLayers,
	setLayers: () => {},
	toggleLayerVisibility: () => {},
	layersData: initialLayersData,
	setLayersData: () => {},
	isLayersDataLoaded: false,
});

export const useLayers = (): LayersContextType => useContext(LayersContext);

export const LayersProvider = ({ children }: { children: React.ReactNode }) => {
	const [layers, setLayers] = useState(totalLayers);
	const [strikeIds, setStrikeIds] = useState<string[]>([]);
	const [layersData, setLayersData] = useState<LayersData>(initialLayersData);
	const [isLayersDataLoaded, setIsLayersDataLoaded] = useState(false);

	// store layersData in ref to avoid re-rendering when it changes in useEffect
	const layersDataRef = useRef<LayersData>(layersData);
	useEffect(() => {
		const fetchLayersData = async () => {
			console.log({ layers });
			const dataEntries = await Promise.all(
				layers.map((layer) => {
					const hasLayerData = layersDataRef.current[layer.id].data !== null;
					const isLayerVisible = layers.find((l) => l.id === layer.id)?.visible;

					if (!isLayerVisible || hasLayerData) {
						return Promise.resolve([layer.id, layersDataRef.current[layer.id]]);
					}

					return getFetchLayerDataPromise(layer);
				}),
			);
			const snapshot = await getDocs(collection(db, "strikes"));
			const data = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			})) as Strike[];
			setStrikeIds(data.map((d) => d.id));

			dataEntries.map((dataEntry) => {
				if (dataEntry[0] === "strikes") {
					dataEntry[1] = {
						data: {
							type: "FeatureCollection",
							crs: {
								properties: {
									name: "EPSG:4326",
								},
								type: "name",
							},
							features: data.map((d) => {
								return {
									properties: {
										Date: d.properties.date,
										SiteTargeted: d.properties.siteTargeted,
										Status: d.properties.status,
									},
									coordinates: d.geometry.coordinates,
									geometry: d.geometry,
								};
							}),
						},
						iconImage: null,
					};
				}
				return dataEntry;
			});
			console.log({ dataEntries });

			setLayersData(Object.fromEntries(dataEntries));
			setIsLayersDataLoaded(true);
		};

		fetchLayersData();
	}, [layers]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: we only want to know if there is a new strike
	useEffect(() => {
		const unsubscribe = onSnapshot(collection(db, "strikes"), (snapshot) => {
			const updatedStrikes = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			})) as Strike[];

			const newStrikes = updatedStrikes.filter(
				(f) => !strikeIds.includes(f.id),
			);
			// create a push notification
			if (newStrikes.length > 0) {
				newStrikes.forEach((strike) => {
					new Notification("New Strike Detected", {
						body: `${strike.properties.siteTargeted} - ${strike.properties.status}`,
						icon: "/favicon.ico",
					});
				});
			}
			setLayersData({
				...layersData,
				strikes: {
					iconImage: null,
					data: {
						type: "FeatureCollection",
						crs: {
							properties: {
								name: "EPSG:4326",
							},
							type: "name",
						},
						features: updatedStrikes.map((d) => {
							return {
								properties: {
									Date: d.properties.date,
									SiteTargeted: d.properties.siteTargeted,
									Status: d.properties.status,
								},
								coordinates: d.geometry.coordinates,
								geometry: d.geometry,
							};
						}),
					},
				},
			});
		});

		return () => unsubscribe(); // clean up on unmount
	}, []);

	const toggleLayerVisibility = useCallback(
		(layerId: keyof typeof layerIds, visible: boolean) => {
			setLayers((prevLayers) =>
				prevLayers.map((layer) =>
					layer.id === layerId ? { ...layer, visible } : layer,
				),
			);
		},
		[],
	);

	return (
		<LayersContext.Provider
			value={{
				layers,
				setLayers,
				toggleLayerVisibility,
				layersData,
				setLayersData,
				isLayersDataLoaded,
			}}
		>
			<LayersDataRefProvider dataRef={layersDataRef}>
				{children}
			</LayersDataRefProvider>
		</LayersContext.Provider>
	);
};
