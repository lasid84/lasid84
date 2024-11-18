type PDFViewerProps = {
    pdfPath: string;
    scale?: number;
    setInputValues: React.Dispatch<React.SetStateAction<Map<string, string>>>;
    detailData: any;
};

type InputLocation = {
    id: string;
    element: string;
    top: string;
    left: string;
    width: string;
    spellcheck?: boolean | undefined;
    rows?: number | undefined;
    fontSize?: string | undefined;
    textAlign?: string | undefined;
    dataDirectory?: number | undefined;
    data_id?: string | undefined;
};

type CommonStyle = {
    position: string;
    borderWidth: string;
    background: string;
    fontSize: string;
    lineHeight: string
    resize: string;
    overflow: string;
    textAlign: string;
    fontFamily: string;
};

export type {
    PDFViewerProps,
    InputLocation,
    CommonStyle
}
