import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import { ConfigProvider, theme, Layout, Space, Button, Input, Upload, Typography, InputNumber } from 'antd';
import 'antd/dist/reset.css';
import './App.css';

import './grids.min.css';

import './grids-responsive.min.css';

import icon from './livestatus_icon.png';

import QRCode from 'qrcode'

const { Header, Footer, Sider, Content } = Layout;

const { Title } = Typography;

function App() {
  const [fileList, setFileList] = useState([]);

  const [qrCodeText, setQrCodeText] = useState('');

  const [qrCodeSize, setQrCodeSize] = useState('120');

  const props = {
    accept: 'image/*',
    maxCount: 1,
    showUploadList: false,
    beforeUpload: async (file) => {
      let dataUrl = await imgReader(file)
      file.src = dataUrl
      setFileList([file]);
      console.log(file)
      return false;
    },
    fileList,
  }

  // With async/await
  let opts = {
    errorCorrectionLevel: 'M',
    type: 'image/png',
    margin: 1,
    width: 400,
    height: 400,
    color: {
      dark:"#000",
      light:"#ffa"
    }
  }

  useEffect(() => {
    generateQR(qrCodeText)
  }, [fileList])

  useEffect(() => {
    generateQR(qrCodeText)
  }, [qrCodeText])

  const removeIcon = () => {
    setFileList([])
  }

  const updateQRCode = (e) => {
    setQrCodeText(e.target.value)
  }

  const generateQR = (text) => {
    let container = document.getElementById('container')
    container.innerHTML = ''
    if (!text) {
      return
    }

    QRCode.toCanvas(text, opts, function (err, canvas) {
      if (err) throw err
      container.appendChild(canvas)
      if (fileList.length) {
        addIcon()
      }
    })

    function addIcon() {
      let canvas = document.querySelector('canvas')
      let context = canvas.getContext('2d')
      console.log(context)
      let newImage = new Image()
      // newImage.src = icon;
      newImage.src = fileList[0].src
      newImage.onload = () => {
        console.log(newImage)
        context.drawImage(newImage, ((400/2) - (64/2)), ((400/2) - (64/2)))
      }
    }
  }

  function download(filename) {
    let canvas = document.querySelector('canvas')
    let dataUrl = canvas.toDataURL('image/png')
    const link = document.createElement("a")
    link.href = dataUrl
    link.download = filename
    link.click()
  }

  function imgReader(file) {
    const reader = new FileReader()
    if (file) {
      if (file.type === 'image/png' ||
        file.type === 'image/jpg' ||
        file.type === 'image/jpeg') {
        reader.readAsDataURL(file)
      } else {
        console.error('file type error')
      }
    } else {
      console.error('not file')
      return
    }

    return new Promise(resolve => {
      reader.addEventListener('load', () => {
        resolve(reader.result)
      }, false)
    })
  }

  return (
    <ConfigProvider
    theme={{
      algorithm: theme.darkAlgorithm,
      token: {
        colorPrimary: '#722ED1',
      },
    }}
  >
    <div className="App">
      <header className="App-header">
        <img id="image" src="" alt="" />
        <button onClick={() => {generateQR('https://livestatus.livelychat.live/EVVrGqvAkCWN14d0bbb?refer=promote_campus')}}>Click me</button>
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <button onClick={() => download('qq.png')}>Download</button>
        <Button type="primary">Button</Button>
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <header>
        <h1>QRCode maker - make qrcode & download easy</h1>
        <h2>You can make QRCode easy & download it as image</h2>
      </header>
      <main className="pure-g">
        <div className="pure-u-1 pure-u-md-1-4">
          <Title level={3}>Input text or url show from QRCode scran</Title>
          <Input placeholder="Input text or URL" onChange={updateQRCode} allowClear={true} defaultValue='' showCount={false} />
        </div>
        <div className="pure-u-1 pure-u-md-1-4">
          <Title level={3}>Add icon in QRCode</Title>
          <Upload {...props}>
            <Button icon={<UploadOutlined />}>Add icon</Button>
          </Upload>
          <Button type="primary" onClick={removeIcon} danger>Remove icon</Button>
        </div>
        <div className="pure-u-1 pure-u-md-1-4">
          <title level={3}>QRCode setting</title>
          <InputNumber min={64} max={1024} value={qrCodeSize} onChange={setQrCodeSize} />
        </div>
        <div className="pure-u-1 pure-u-md-1-4">
          <Button type="primary" icon={<DownloadOutlined />}>Download</Button>
        </div>
      </main>
      <section>
        <div id='container'></div>
      </section>
      <footer>Footer</footer>
    </div>
  </ConfigProvider>
  );
}

export default App;
