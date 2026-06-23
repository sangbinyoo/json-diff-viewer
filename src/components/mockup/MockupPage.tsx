import React, { useEffect, useRef, useState } from 'react'
import { Toolbar } from './Toolbar'
import { FilePanel } from './FilePanel'
import { ResultNode, ResultPanel } from './ResultPanel'
import styles from './MockupPage.module.css'
import { getResultNodes } from '../../utils/getResultNodes'


export const MockupPage: React.FC = () => {
  const [sortValue, setSortValue] = useState('key')
  const ref = useRef<HTMLInputElement>(null);
  const upldateButton = () =>{
    if(!ref.current) return;
    ref.current.click();
  }

  const [fileContents, setFileContents] = useState<string[]>([]);
  const [fileNames, setFileNames] = useState<string[]>([]);

  useEffect(() => {
    if(fileContents.length === 2)
      handleCompare();
  }, [sortValue])

  // 파일 업로드 핸들러
  const handleUpload = (event:React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if(!files) return
    if(files.length !== 2) {
      alert('Please select exactly 2 files.');
      setFileContents([]);
      setFileNames([]);
      event.target.value = '';
      return;
    }
    for(let i=0; i<files.length; i++){
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setFileContents(prev => [...prev, content]);
      }
      setFileNames(prev => [...prev, files[i].name]);
      reader.readAsText(files[i])
    }
  }
  const [allNodes, setAllNodes] = useState<ResultNode[]>([]);
  //파일 비교 핸들러
  const handleCompare = () => {
    const originObj = JSON.parse(fileContents[0]);
    const targetObj = JSON.parse(fileContents[1]);
    const nodes = getResultNodes(originObj, targetObj, null as unknown as ResultNode, sortValue);
    setAllNodes(nodes);
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>JSON Comparator</h1>
      <input onChange={(event:React.ChangeEvent<HTMLInputElement>)=>{
        handleUpload(event);
      }} type="file" multiple ref={ref} hidden />
      <Toolbar
        sortValue={sortValue}
        onSortChange={setSortValue}
        onUpload={() => upldateButton() }
        onCompare={() => handleCompare()}
        onExport={() => alert('Export 클릭')}
      />

      <main className={styles.grid}>
        <FilePanel label="origin file" fileName={fileNames[0]} children={fileContents[0]} />
        <FilePanel label="target file" fileName={fileNames[1]} children={fileContents[1]} />
        <ResultPanel nodes={allNodes} />
      </main>
    </div>
  )
}
