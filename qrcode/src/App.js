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

const headerStyle = {
  textAlign: 'left',
  color: '#fff',
  minHeight: 64,
  paddingInline: 16,
  lineHeight: '48px',
  // backgroundColor: '#7dbcea',
  fontSize: '24px',
  fontWeight: 'bold'
};

const contentStyle = {
  textAlign: 'center',
  minHeight: 120,
  lineHeight: '120px',
  color: '#fff',
  backgroundColor: '#282c34'
  // backgroundColor: '#108ee9',
};

const footerStyle = {
  textAlign: 'center',
  color: '#fff',
  // backgroundColor: '#7dbcea',
};

function App() {
  const [fileList, setFileList] = useState([]);

  const [qrCodeText, setQrCodeText] = useState('');

  const [qrCodeSize, setQrCodeSize] = useState('120');

  const props = {
    accept: 'image/*',
    maxCount: 1,
    showUploadList: false,
    beforeUpload: (file) => {
      setFileList([file]);
      console.log(file)
      return false;
    },
    fileList,
  }

  // With async/await
  var opts = {
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
    console.log(fileList)
  }, [fileList])

  const removeIcon = () => {
    setFileList([])
  }

  const updateQRCode = (e) => {
    console.log(e)
  }

  const generateQR = (text) => {

    QRCode.toCanvas(text, opts, function (err, canvas) {
      if (err) throw err

      var container = document.getElementById('container')
      container.appendChild(canvas)
      make_base()
    })

    function make_base() {
      let canvas = document.querySelector('canvas')
      let context = canvas.getContext('2d')
      console.log(context)
      let base_image = new Image();
      base_image.src = icon;
      base_image.onload = () => {
        console.log(base_image)
        context.drawImage(base_image, ((400/2) - (64/2)), ((400/2) - (64/2)));
      }
    }
  }

  function download(filename) {
    let canvas = document.querySelector('canvas')
    let dataUrl = canvas.toDataURL('image/png')

    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = filename;
    link.click();
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
        <div id='container'></div>
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
      <Layout>
        <Header style={headerStyle}>
          <Title>QRCode maker - make qrcode & download easy</Title>
          <Title level={2}>You can make QRCode easy & download it as image</Title>
        </Header>
        <Content style={contentStyle}>
          <main className="pure-g">
            <div className="pure-u-1 pure-u-md-1-4">
              <Title level={3}>Input text or url show from QRCode scran</Title>
              <Input onChange={updateQRCode} placeholder="Input text or URL" value={qrCodeText} />
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

          </section>
        </Content>
        <Footer style={footerStyle}>Footer</Footer>
      </Layout>
    </div>
  </ConfigProvider>
  );
}

export default App;
