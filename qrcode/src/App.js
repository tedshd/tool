import React, { useState, useEffect, useCallback } from 'react';
import reactCSS from 'reactcss'
import { SketchPicker } from 'react-color'
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import { ConfigProvider, theme, Space, message, Form, Button, Input, Upload, Typography, InputNumber } from 'antd';
import useInputChange from './hooks/useInputChange'
import { useTranslation } from 'react-i18next'
import 'antd/dist/reset.css';
import './App.css';

import './grids.min.css';
import './grids-responsive.min.css';

import QRCode from 'qrcode'

const { Title } = Typography;

function App() {
  const [fileList, setFileList] = useState([])
  const { t, i18n } = useTranslation()

  const [qrCodeText, setQrCodeText] = useInputChange('')
  const [debouncedQrCodeText, setDebouncedQrCodeText] = useState('')
  const [qrCodeTextStatus, setQrCodeTextStatus] = useState('')
  const [fileName, setFilename] = useInputChange('qrcode')

  const [qrCodeSize, setQrCodeSize] = useState(120)
  const [iconSize, setIconSize] = useState(32)

  const [colorPickerBgProps, setColorPickerBgProps] = useState({
    displayColorPicker: false,
    color: {
      hex: '#fff',
      rgb: {
        r: 255,
        g: 255,
        b: 255,
        a: 1,
      },
      hsl: {
        h: 0,
        s: 0,
        l: 1,
        a: 1,
      },
    }
  })

  const [colorPickerFgProps, setColorPickerFgProps] = useState({
    displayColorPicker: false,
    color: {
      hex: '#000',
      rgb: {
        r: 0,
        g: 0,
        b: 0,
        a: 1,
      },
      hsl: {
        h: 0,
        s: 0,
        l: .0,
        a: 1,
      },
    }
  })

  const colorPickBgStyles = reactCSS({
    'default': {
      color: {
        width: '36px',
        height: '14px',
        borderRadius: '2px',
        background: `rgba(${ colorPickerBgProps.color.rgb.r }, ${ colorPickerBgProps.color.rgb.g }, ${ colorPickerBgProps.color.rgb.b }, ${ colorPickerBgProps.color.rgb.a })`,
      },
      swatch: {
        padding: '5px',
        background: '#141414',
        borderRadius: '1px',
        boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
        display: 'inline-block',
        cursor: 'pointer',
      },
      popover: {
        position: 'absolute',
        zIndex: '2',
      },
      cover: {
        position: 'fixed',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
      },
    },
  });

  const colorPickFgStyles = reactCSS({
    'default': {
      color: {
        width: '36px',
        height: '14px',
        borderRadius: '2px',
        background: `rgba(${ colorPickerFgProps.color.rgb.r }, ${ colorPickerFgProps.color.rgb.g }, ${ colorPickerFgProps.color.rgb.b }, ${ colorPickerFgProps.color.rgb.a })`,
      },
      swatch: {
        padding: '5px',
        background: '#141414',
        borderRadius: '1px',
        boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
        display: 'inline-block',
        cursor: 'pointer',
      },
      popover: {
        position: 'absolute',
        zIndex: '2',
      },
      cover: {
        position: 'fixed',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
      },
    },
  });

  const colorClick = (type) => {
    if (type === 'bg') {
      setColorPickerBgProps({
        displayColorPicker: !colorPickerBgProps.displayColorPicker,
        color: {...colorPickerBgProps.color}
      })
    } else {
      setColorPickerFgProps({
        displayColorPicker: !colorPickerFgProps.displayColorPicker,
        color: {...colorPickerFgProps.color}
      })
    }
  }

  const colorClose = (type) => {
    if (type === 'bg') {
      setColorPickerBgProps({
        displayColorPicker: false,
        color: {...colorPickerBgProps.color}
      })
    } else {
      setColorPickerFgProps({
        displayColorPicker: false,
        color: {...colorPickerFgProps.color}
      })
    }
  }

  const ColorChange = (color, type) => {
    if (type === 'bg') {
      setColorPickerBgProps({
        ...colorPickerBgProps,
        color: color
      })
    } else {
      setColorPickerFgProps({
        ...colorPickerFgProps,
        color: color
      })
    }
  }

  const props = {
    accept: 'image/*',
    maxCount: 1,
    showUploadList: false,
    beforeUpload: async (file) => {
      let dataUrl = await imgReader(file)
      file.src = dataUrl
      setFileList([file]);
      return false;
    },
    fileList,
  }

  useEffect(() => {
    if (qrCodeText) {
      setQrCodeTextStatus('')
    }
    const handler = setTimeout(() => {
      setDebouncedQrCodeText(qrCodeText)
    }, 300)
    return () => clearTimeout(handler)
  }, [qrCodeText])

  useEffect(() => {
    // Keep the SEO-optimized <title> set in index.html — don't overwrite it
    // with the on-page H1 copy, which targets readability, not search intent.
    document.documentElement.lang = i18n.language
  }, [i18n.language])

  const removeIcon = () => {
    setFileList([])
  }

  const generateQR = useCallback((text) => {
    let container = document.getElementById('container')
    container.innerHTML = ''
    if (!text) {
      return
    }

    let opts = {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      margin: 1,
      width: qrCodeSize,
      height: qrCodeSize,
      color: {
        dark: colorPickerFgProps.color.hex,
        light: colorPickerBgProps.color.hex
      }
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
      let newImage = new Image()
      newImage.src = fileList[0].src
      newImage.onload = () => {
        let w = iconSize
        let h = iconSize * (newImage.width / newImage.height)
        let x = (qrCodeSize / 2) - (w / 2)
        let y = (qrCodeSize / 2) - (h / 2)
        context.drawImage(newImage, x, y, w, h)
      }
    }
  }, [fileList, iconSize, qrCodeSize, colorPickerFgProps.color.hex, colorPickerBgProps.color.hex])

  useEffect(() => {
    generateQR(debouncedQrCodeText)
  }, [debouncedQrCodeText, generateQR])

  const download = () => {
    if (!qrCodeText) {
      message.error('Please input text for QRCode')
      setQrCodeTextStatus('error')
      return
    }
    let downloadName = fileName || `qrcode`
    let canvas = document.querySelector('canvas')
    let dataUrl = canvas.toDataURL('image/png')
    const link = document.createElement("a")
    link.href = dataUrl
    link.download = `${downloadName}.png`
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
      <header className='p-8'>
        <h1>{ t('h1_title') }</h1>
        <h2>{ t('desc') }</h2>
        <p className="about-desc">{ t('about_desc') }</p>
      </header>
      <main className="pure-g">
        <div className="pure-u-1  pure-u-md-1-2 pure-u-lg-1-4 p-16">
          <Title level={3}>{ t('input_title') }</Title>
          <hr/>
          <Form
            name="basic"
            layout="vertical"
            labelCol={{ span: 16 }}
            wrapperCol={{ span: 16 }}
          >
            <Form.Item label={ t('input_label') } validateTrigger={'onChange'} validateStatus={qrCodeTextStatus}>
              <Input minLength={1} placeholder={ t('input_label') } onChange={setQrCodeText} allowClear={true} value={qrCodeText} showCount={false} required />
            </Form.Item>
          </Form>
        </div>
        <div className="pure-u-1  pure-u-md-1-2 pure-u-lg-1-4 p-16">
          <Title level={3}>{ t('add_icon_title') }</Title>
          <hr/>
          <Form
            name="basic"
            layout="vertical"
            labelCol={{ span: 16 }}
            wrapperCol={{ span: 16 }}
          >
            <Form.Item label={ t('icon_size') }>
              <InputNumber aria-label={ t('icon_size') } min={32} max={512} value={iconSize} onChange={setIconSize} />
            </Form.Item>
            <Form.Item label={ t('add_icon_label') }>
              <Space>
                <Upload {...props}>
                  <Button icon={<UploadOutlined />}>{  t('add_icon_label') }</Button>
                </Upload>
                <Button type="primary" onClick={removeIcon} danger>{ t('remove_icon') }</Button>
              </Space>
            </Form.Item>
          </Form>
        </div>
        <div className="pure-u-1  pure-u-md-1-2 pure-u-lg-1-4 p-16">
          <Title level={3}>{ t('qrcode_setting_title') }</Title>
          <hr/>
          <Form
            name="basic"
            layout="vertical"
            labelCol={{ span: 16 }}
            wrapperCol={{ span: 16 }}
          >
            <Form.Item label={ t('qrcode_size') }>
              <InputNumber aria-label={ t('qrcode_size') } min={64} max={1024} value={qrCodeSize} onChange={setQrCodeSize} />
            </Form.Item>
            <Form.Item label={ t('bg_color') }>
              <div style={ colorPickBgStyles.swatch } onClick={ () => {colorClick('bg')} }>
                <div style={ colorPickBgStyles.color } />
              </div>
              { colorPickerBgProps.displayColorPicker ? <div style={ colorPickBgStyles.popover }>
                <div style={ colorPickBgStyles.cover } onClick={ () => {colorClose('bg')} }/>
                <SketchPicker color={ colorPickerBgProps.color } onChange={ (color) => {ColorChange(color, 'bg')} } />
              </div> : null }
            </Form.Item>
            <Form.Item label={ t('qrcode_color') }>
              <div style={ colorPickFgStyles.swatch } onClick={ () => {colorClick('fg')} }>
                <div style={ colorPickFgStyles.color } />
              </div>
              { colorPickerFgProps.displayColorPicker ? <div style={ colorPickFgStyles.popover }>
                <div style={ colorPickFgStyles.cover } onClick={ () => {colorClose('fg')} }/>
                <SketchPicker color={ colorPickerFgProps.color } onChange={ (color) => {ColorChange(color, 'fg')} } />
              </div> : null }
            </Form.Item>
          </Form>
        </div>
        <div className="pure-u-1  pure-u-md-1-2 pure-u-lg-1-4 p-16">
          <Title level={3}>{ t('qrcode_output_title') }</Title>
          <hr/>
          <Form
            name="basic"
            layout="vertical"
            labelCol={{ span: 16 }}
            wrapperCol={{ span: 16 }}
          >
            <Form.Item label={ t('file_name') }>
              <Input minLength={1} maxLength={2048} value={fileName} onChange={setFilename}  placeholder={ t('input_file_name') } />
            </Form.Item>
            <Button type="primary" icon={<DownloadOutlined />} onClick={download} >{ t('download') }</Button>
          </Form>
        </div>
      </main>
      <section>
        <div id='container'></div>
      </section>
      <section className="faq p-16">
        <Title level={3}>{ t('faq_title') }</Title>
        <hr/>
        <div className="faq-item">
          <Title level={4}>{ t('faq_q1') }</Title>
          <p>{ t('faq_a1') }</p>
        </div>
        <div className="faq-item">
          <Title level={4}>{ t('faq_q2') }</Title>
          <p>{ t('faq_a2') }</p>
        </div>
        <div className="faq-item">
          <Title level={4}>{ t('faq_q3') }</Title>
          <p>{ t('faq_a3') }</p>
        </div>
      </section>
      <footer className="p-16">
        <p>{ t('footer_privacy') }</p>
        <p>
          © {new Date().getFullYear()} QRCode Maker · <a href="https://github.com/tedshd/tool" target="_blank" rel="noopener noreferrer">{ t('footer_source') }</a>
        </p>
      </footer>
    </div>
  </ConfigProvider>
  );
}

export default App;
