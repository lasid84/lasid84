type PDFViewerProps = {
    pdfPath: string;
    scale?: number;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleViewPort: (viewPort: ViewPort) => void;
    detailData: any;
    locationData: any;
};

type ViewPort = {
    width: number;
    height: number;
};

type assignLocationParam = {
    container: HTMLDivElement;
    mode: string;
    locationData: any;
    inputValues?: Map<string, string>;
    viewPort?: ViewPort;
    handleInputChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    detailData?: any;
}

export type {
    PDFViewerProps,
    ViewPort,
    assignLocationParam
}