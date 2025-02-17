
import React, { FC, useEffect, useRef, useState } from 'react';
// import ReactQuill from 'react-quill';
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';
// import './css/quillCss.css';

type Props= {
    id: string
    height?: string
    value?: string
    onContentChange?: (content: string) => void;
}

const EditorQuill: FC<Props> = (props) => {
  const { id, height = '100%', value = '', onContentChange} = props
  // const quillRef = useRef(null);

  // 툴바 모듈 설정 (원하는 옵션에 따라 커스터마이징 가능)
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ color: [] }, { background: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
      ['clean']
    ],
  };

  // 지원할 포맷 목록
  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'color', 'background',
    'list', 'bullet',
    'link', 'image'
  ];

  return (
    <div className="w-full h-full my-editor-wrapper">
      <ReactQuill
        id={id}
        // ref={quillRef}
        style={{ height: height }} 
        theme="snow"
        value={value}
        onChange={onContentChange}
        modules={modules}
        formats={formats}
      />
    </div>
  );
};

export default EditorQuill;
