"use client"

import PageContent from "@/shared/tmpl/page-content"
import { useMemo } from "react";
import {AgGridReact} from "ag-grid-react"

type Props = {
    listItem: any | null
}
const ListGrid: React.FC<Props> = () => {
    
  const containerStyle = useMemo(() => "flex flex-col w-full", []);
  const gridStyle = useMemo(() => "w-full h-[450px]", []);
    return (
        <>
            <PageContent
                right={<>이벤트 버튼</>}
            >
            </PageContent>
            <div className={containerStyle}>
                <div className={`ag-theme-custom ${gridStyle}`}>
                    <AgGridReact
                    
                    />
                </div>
            </div>
        </>
    )
}

export default ListGrid