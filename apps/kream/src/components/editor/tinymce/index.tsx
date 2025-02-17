import React, { useState, FC } from 'react';
import { Editor } from '@tinymce/tinymce-react';

const MyEditor: FC = () => {
  // 로컬 상태로 데이터를 관리 (초기값 직접 지정)
  const [content, setContent] = useState<string>('<p>초기 내용입니다.</p>');

  // 에디터 내용이 변경될 때 호출되는 콜백
  const handleEditorChange = (newContent: string, editor: any): void => {
    setContent(newContent);
    console.log('새로운 내용:', newContent);
    // 여기서 직접 처리하는 로직(예: 서버에 전송, 로컬 저장 등)을 구현할 수 있습니다.
  };

  return (
    <Editor
    //   apiKey="YOUR_TINYMCE_API_KEY" // 필요에 따라 API 키 설정 (테스트 시 생략 가능)
      value={content}
      init={{
        height: 500,
        menubar: true,
        plugins: [
          'advlist autolink lists link image charmap print preview anchor',
          'searchreplace visualblocks code fullscreen',
          'insertdatetime media table paste code help wordcount'
        ],
        toolbar:
          'undo redo | formatselect | bold italic underline forecolor backcolor | ' +
          'alignleft aligncenter alignright alignjustify | ' +
          'bullist numlist outdent indent | removeformat | help',
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
      }}
      onEditorChange={handleEditorChange}
    />
  );
};

export default MyEditor;
