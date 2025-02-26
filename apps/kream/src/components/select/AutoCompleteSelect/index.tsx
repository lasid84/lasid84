import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { flushSync } from "react-dom";

import { CiSearch } from "react-icons/ci";

import Hangul from "hangul-js";

import { FixedSizeList as List, FixedSizeList } from "react-window";
import { FaHashtag } from "react-icons/fa";
import { gridData } from "@/components/grid/ag-grid-enterprise";

import { log } from '@repo/kwe-lib-new';

type Item = {
    main: string;
    sub: string;
    mark?: string | null;
    split?: string;
  };

type Props = {
    value?: string;
    values: Item[];
    onClose: (isOpen: boolean) => void;
}

export interface AutoCompleteSelectRef {
    getValue: () => any//Item | string | undefined;
    isPopup: () => boolean;
  }

const ITEM_HEIGHT = 100;

const AutoCompleteSelct = forwardRef<AutoCompleteSelectRef, Props>((props: Props, ref) => {
    /**
     * @dev
     * value => 선택한 cell의 기존 값.
     * values => display 될 list.
     */
    const { value, values, onClose } = props;

    const listRef = useRef<FixedSizeList<any> | null>(null);
    
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [dataList, setDataList] = useState(values);

    useImperativeHandle(ref, () => ({
        getValue: () => {
            if (selectedIndex < 0) {
                return {};
            }

            if (dataList[selectedIndex]) {
                return dataList[selectedIndex];
            }
        },
        isPopup: () => true,
    }));

    const handleListClick = (index: number) => {
        flushSync(() => {
            setSelectedIndex(index);
        });
        onClose(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
        if (!listRef.current) {
            return;
        }
        
        const keysToHandle = ["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", "Escape", "Enter"];

        if (event.target instanceof HTMLInputElement) {
          if (!keysToHandle.includes(event.key)) {
            return;
          }
        }
        event.preventDefault();
        
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
        } else if (event.key === 'Enter') {
            handleListClick(selectedIndex);
        } else if (event.key === "Escape") {
            handleListClick(-1);
        }
    };

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        
        const filterValues = values.filter((value) => {
            const lowerSearchText = event.target.value.toLowerCase();
            // log('handleSearch', value, event.target.value.toLowerCase())    
            const lowerMain = value.main?.toLowerCase() || '';
            const lowerSub = value.sub?.toLowerCase() || '';

            // const koreanMainDisassemble = Hangul.disassemble(value.main || '').join("").includes(lowerSearchText);
            // const koreanMainMatch = Hangul.search(value.main || '', lowerSearchText) >= 0;

            // const koreanSubDisassemble = Hangul.disassemble(value.sub || '').join("").includes(lowerSearchText);
            // const koreanSubMatch = Hangul.search(value.sub || '', lowerSearchText) >= 0;

            return (
                lowerMain.includes(lowerSearchText) ||
                // koreanMainDisassemble ||
                // koreanMainMatch

                // ||
                
                lowerSub.includes(lowerSearchText) //||
                // koreanSubDisassemble ||
                // koreanSubMatch
            );
        });

        setDataList(filterValues);
        setSelectedIndex(0);
    };

    const handleExit = () => {
        flushSync(() => {
            setSelectedIndex(-1);
        });
        // props.api.stopEditing(false);
        onClose(false);
    };

    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollToItem(selectedIndex, 'start');
        }

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [selectedIndex]);

    // 각 행을 렌더링하는 컴포넌트
  const Row = ({ index, style }:any) => {
    const item = dataList[index];
    return (
      <div
        style={style}
        className={`mt-3 border-b hover:bg-sky-200 hover:text-white hover:border hover:rounded-md ${
          selectedIndex === index ? "bg-blue-400 text-white rounded-md" : ""
        }`}
        onClick={() => handleListClick(index)}
      >
        <div className="flex flex-row">
          {item.mark && (
            <div className="flex flex-row items-center justify-center mx-2">
              <span className="p-2 text-sm text-gray-600 border rounded">{item.mark}</span>
            </div>
          )}
          <div key={item.main} className="flex flex-row flex-1 p-5">
            <span className="text-sm font-semibold">{item.main}</span>
          </div>
        </div>
        <div className="flex flex-row justify-end">
          {item.sub.split(item.split || '').map((sub_item:any, index2:any) => (
            <div key={index2} className="flex flex-row justify-center">
              <div className="flex items-center justify-center mx-2">
                <span className="p-2 text-base text-gray-600">
                  <FaHashtag />
                </span>
              </div>
              <div className="m-3 ml-1">
                <span className="text-xs">{sub_item}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

    return (
        <div className={`fixed inset-0 flex items-center justify-center border rounded-lg z-50`}>
            <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-md" onClick={handleExit}/>
  
            <div className="relative flex flex-col w-1/2 bg-white border border-white rounded-lg shadow-lg z-99 h-2/3">
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
        
                <List
                    ref={listRef}
                    className="flex-1 mt-3"
                    height={window.innerHeight * 0.6} 
                    itemCount={dataList.length}
                    itemSize={ITEM_HEIGHT}
                    width="100%"
                    >
                    {Row}
                </List>
            </div>
        </div>
    );
});

export default AutoCompleteSelct;