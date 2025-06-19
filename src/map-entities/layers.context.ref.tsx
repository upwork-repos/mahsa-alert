import { createContext, useContext, useRef } from "react";
import { initialLayersData } from "./layers/layers.utils";
import type { LayersData } from "./layers.context.types";

export const LayersDataRefContext = createContext<
	React.MutableRefObject<LayersData>
>({
	current: initialLayersData,
});

export const useLayersDataRef = () => {
	return useContext(LayersDataRefContext);
};

export const LayersDataRefProvider = ({
	dataRef,
	children,
}: {
	dataRef: React.MutableRefObject<LayersData>;
	children: React.ReactNode;
}) => {
	const layersDataRef = useRef<LayersData>(dataRef.current);

	return (
		<LayersDataRefContext.Provider value={layersDataRef}>
			{children}
		</LayersDataRefContext.Provider>
	);
};
