'use client'

import { useReducer, useMemo } from "react"
import { SP_Load } from "./_component/data"
import { reducer, TableContext, LOAD, crudType } from "components/provider/contextObjectProvider";
import SearchForm from "./_component/search-form"
import { useGetData } from "components/react-query/useMyQuery";
import MasterGrid from './_component/gridMaster'

const Stnd0005: React.FC = () => {

    const [state, dispatch] = useReducer(reducer, {
        objState: {
            searchParams: {},
            mSelectedRow: {},
            isMSearch: false,
            isPopupOpen:false,    
            crudType : {}       
        }
    })
    const { objState } = state;
    const { searchParams } = objState;
    const val = useMemo(() => { return { dispatch, objState }}, [state]);
    const { data: initData } = useGetData(searchParams, LOAD, SP_Load, { staleTime: 1000 * 60 * 60 });

    return (
        <TableContext.Provider value={val}>
            <SearchForm initData={initData} />
            <div className="flex flex-col w-full">
                <div className={`ag-theme-custom w-full h-[450px]`}>
                    <MasterGrid initData={initData} />
                </div>
            </div>
        </TableContext.Provider>

    )

}

export default Stnd0005