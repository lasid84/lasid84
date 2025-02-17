import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { flushSync } from "react-dom";

import { CiSearch } from "react-icons/ci";

import Hangul from "hangul-js";

import { ICellEditorParams } from "ag-grid-community";
import { ISelectCellEditorParams } from "ag-grid-enterprise";

import { FaHashtag } from "react-icons/fa";

const CustomSelectCellEditor = forwardRef((props: ICellEditorParams<any> & ISelectCellEditorParams<any>, ref) => {
    /**
     * @dev
     * value => 선택한 cell의 기존 값.
     * values => display 될 list.
     */
    const { value, values } = props;

    const editorRef = useRef<(HTMLDivElement | null)[]>([]);
    
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [dataList, setDataList] = useState(values);

    useImperativeHandle(ref, () => ({
        getValue: () => {
            if (selectedIndex < 0) {
                return value;
            }
            /**
             * @dev
             * ag grid 기본 Enter 리스너 핸들러로 인해 Enter 키에 한해서 커스텀 핸들링 불가.
             */
            if (dataList[selectedIndex]) {
                return dataList[selectedIndex].main;
            }
        },
        isPopup: () => true,
    }));

    const handleListClick = (index: number) => {
        flushSync(() => {
            setSelectedIndex(index);
        });
        props.api.stopEditing();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
        if (!editorRef.current) {
            return;
        }
        
        if (event.key === "ArrowDown") {
            setSelectedIndex((prev) => ((prev + 1) >= dataList.length)? dataList.length -1 : (prev + 1) % dataList.length);
        } else if (event.key === "ArrowUp") {
            setSelectedIndex((prev) => ((prev - 1) + dataList.length <= dataList.length)? 0 : (prev - 1) + dataList.length % dataList.length);
        } else if (event.key === "PageDown") {
            setSelectedIndex((prev) => ((prev + 5) >= dataList.length)? dataList.length -1 : (prev + 5) % dataList.length);
        } else if (event.key === "PageUp") {
            setSelectedIndex((prev) => (prev - 5 + dataList.length <= dataList.length)? 0 : (prev - 5) + dataList.length % dataList.length);
        } else if (event.key === "End") {
            setSelectedIndex(dataList.length -1);
        } else if (event.key === "Home") {
            setSelectedIndex(0);
        } else if (event.key === "Escape") {
            props.api.stopEditing(false);
        }
    };

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const filterValues = values.filter((value) => {
            const lowerSearchText = event.target.value.toLowerCase();
            
            const lowerMain = value.main.toLowerCase();
            const lowerSub = value.sub.toLowerCase();

            const koreanMainDisassemble = Hangul.disassemble(value.main).join("").includes(lowerSearchText);
            const koreanMainMatch = Hangul.search(value.main, lowerSearchText) >= 0;

            const koreanSubDisassemble = Hangul.disassemble(value.sub).join("").includes(lowerSearchText);
            const koreanSubMatch = Hangul.search(value.sub, lowerSearchText) >= 0;

            return (
                lowerMain.includes(lowerSearchText) ||
                koreanMainDisassemble ||
                koreanMainMatch

                ||
                
                lowerSub.includes(lowerSearchText) ||
                koreanSubDisassemble ||
                koreanSubMatch
            );
        });

        setDataList(filterValues);
        setSelectedIndex(0);
    };

    const handleExit = () => {
        flushSync(() => {
            setSelectedIndex(-1);
        });
        props.api.stopEditing(false);
    };

    useEffect(() => {
        if (editorRef.current) {
            editorRef.current[selectedIndex]?.scrollIntoView({
                behavior: "instant",
                block: "start"
            });
        }
        
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [selectedIndex]);

    return (
        <div className="fixed inset-0 flex items-center justify-center border rounded-lg z-90">
            <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-md" onClick={handleExit}/>
  
            <div className="relative z-10 flex flex-col w-1/2 bg-white border border-white rounded-lg shadow-lg h-2/3">
                <div className="flex flex-row items-center justify-start pl-3 border-b">
                    <CiSearch />
                    <input
                        key={0}
                        className="flex-1 h-12 ml-2 text-sm"
                        placeholder="검색어를 입력해주세요."
                        onChange={handleSearch}
                        autoFocus
                    />
                </div>
        
                <ul className="flex-1 p-3 mt-3 overflow-y-auto min-h-1/2">
                    <ul className="flex flex-col">
                        {dataList.map((item, index1) => (
                            <div key={index1} ref={(idx) => editorRef.current[index1] = idx}
                                className={`mt-3 border-b hover:bg-sky-200 hover:text-white hover:border hover:rounded-md ${
                                    selectedIndex === index1 ? "bg-blue-400 text-white rounded-md" : ""
                                  }`} 
                                onClick={() => handleListClick(index1)}>
                                <div className="flex flex-row">
                                    {item.mark &&
                                        <div className="flex flex-row items-center justify-center mx-2">
                                            <span className="p-2 text-sm text-gray-600 border rounded">{item.mark}</span>
                                        </div>
                                    }
                                    <li key={item.main} className="flex flex-row flex-1 p-5">
                                        <span className="text-sm font-semibold">{item.main}</span>
                                    </li>
                                </div>
                                <div className="flex flex-row justify-end">
                                    {item.sub.split(item.split).map((sub_item: string, index2: number) => (
                                        <div key={index2} className="flex flex-row justify-center">
                                            <div className="flex items-center justify-center mx-2">
                                                <span className="p-2 text-base text-gray-600"><FaHashtag /></span>
                                            </div>
                                            <div className="m-3 ml-1">
                                                <span className="text-xs">{sub_item}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </ul>
                </ul>
            </div>
        </div>
    );
});

export default CustomSelectCellEditor;