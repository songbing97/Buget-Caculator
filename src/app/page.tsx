'use client'
import styles from './page.module.css'
import MainTable from './mainTable'
import { Button } from 'antd'

export default function Home() {
  const copy = () => {
    
    (document.getElementById('copyvalue')! as HTMLInputElement).value = window.location.href
    var e = document.getElementById("copyvalue");
    (e! as HTMLInputElement).select(); // 选择对象
    document.execCommand("Copy"); // 执行浏览器复制命令
  }
  return (
    <main className={styles.main}>
      <input id="copyvalue" style={{opacity: 0,position: 'absolute'}}></input>
      <h1 className="text-4xl font-bold">
        Welcome to use Budget Calculator!
      </h1>
      <MainTable></MainTable>
      <h3 className="text-1xl font-bold">
        <Button onClick={copy}>Click here to share your friends!</Button>
      </h3>
    </main>
  )
}
