import React, { useEffect, useRef, useState } from 'react'
import { Toolbar } from './Toolbar'
import { FilePanel } from './FilePanel'
import { ResultNode, ResultPanel } from './ResultPanel'
import styles from './MockupPage.module.css'
import { getResultNodes } from '../../utils/getResultNodes'


export const MockupPage: React.FC = () => {
  const [sortValue, setSortValue] = useState('original')
  const ref = useRef<HTMLInputElement>(null);
  const upldateButton = () =>{
    if(!ref.current) return;
    ref.current.click();
  }

  const [fileContents, setFileContents] = useState<string[]>([]);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [disableBtnCompare, setDisableBtnCompare] = useState<boolean>(true);
  const [disableBtnExport, setDisableBtnExport] = useState<boolean>(true);
  //sort type변경시 다시 비교
  useEffect(() => {
    if(fileContents.length === 2)
      compareFiles();
  }, [sortValue])

  // 파일 업로드 핸들러
  const handleUpload = (event:React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if(!files || files.length !== 2) {
      alert('Please select exactly 2 files.');
      event.target.value = '';
      return;
    }

    clearScreen();
    for(let i=0; i<files.length; i++){
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setFileContents(prev => [...prev, content]);
      }
      setFileNames(prev => [...prev, files[i].name]);
      reader.readAsText(files[i])
    }
    setDisableBtnCompare(false);
  }
  const [allNodes, setAllNodes] = useState<ResultNode[]>([]);

  //파일 비교 함수
  const compareFiles = () => {
    const originObj = JSON.parse(fileContents[0]);
    const targetObj = JSON.parse(fileContents[1]);
    const nodes = getResultNodes(originObj, targetObj, null as unknown as ResultNode, sortValue);
    setAllNodes(nodes);
    setDisableBtnExport(false);
  }

  //Json 내보내기 함수
  const exportToJson = () => {
    const json = JSON.stringify(allNodes, null, 2);
    const blob = new Blob([json], { type: 'application/json' }); 

    // 다운로드 트리거
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `diff-result-${new Date().toISOString().slice(0, 10)}.json`
    a.click()

    // 메모리 해제
    URL.revokeObjectURL(url)
  }

  //화면 초기화 함수
  const clearScreen = () =>{
      setFileContents([]);
      setFileNames([]);
      setAllNodes([]);
      setDisableBtnCompare(true);
      setDisableBtnExport(true)
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>JSON Comparator</h1>
      <input onChange={(event:React.ChangeEvent<HTMLInputElement>)=>{
        handleUpload(event);
      }} type="file" multiple ref={ref} hidden />
      <Toolbar
        sortValue={sortValue}
        disableBtnCompare={disableBtnCompare}
        disableBtnExport={disableBtnExport}
        onSortChange={setSortValue}
        onUpload={() => upldateButton() }
        onCompare={() => compareFiles()}
        onExport={() => exportToJson()}
      />

      <main className={styles.grid}>
        <FilePanel label="origin file" fileName={fileNames[0]} children={fileContents[0]} />
        <FilePanel label="target file" fileName={fileNames[1]} children={fileContents[1]} />
        <ResultPanel nodes={allNodes} />
      </main>
    </div>
  )
}
