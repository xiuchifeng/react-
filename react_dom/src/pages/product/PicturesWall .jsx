import React, { Component } from 'react'
import { Upload, Icon, Modal, message } from 'antd';
import { reqDeleteImg } from "../../api/index"
import {BASE_URL} from "../../init/init"
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
export default class PicturesWall extends Component {
  constructor(props) {
    super(props);
    const { imgs } = this.props;//如果是添加页面  是undefined  如果是修改页面 imgs数组
    let fileList = [];
    if (imgs) {   //如果是修改页面
      fileList = imgs.map((item, index) => ({
        uid: -index,
        name: item,
        status: 'done',
        url: BASE_URL + item
      }))
    }
    this.state = {
      previewVisible: false,
      previewImage: '',
      fileList
    }
  }
  //根据fileList 生成图片名字组成的数组
  getImgs = () => this.state.fileList.map(item => item.name)
  handleCancel = () => this.setState({ previewVisible: false });

  //预览触发
  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };


  handleChange = async ({ file, fileList }) => {
    //图片上传完成后摇添加url并修改name
    if (file.status === "done") {
      const { data, msg } = file.response;
      const newfile = fileList[fileList.length - 1]
      message.success(msg)
      newfile.name = data.name;
      newfile.url = data.url
    } else if (file.status === "removed") {
      const result = await reqDeleteImg(file.name)
      const { status, msg } = result
      if (status === 0) {
        message.success(msg)
      }
    }
    this.setState({ fileList })
  };
  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          action="/image/upload"
          listType="picture-card"
          fileList={fileList}
          name="image"
          accept="image/*"
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {/* 允许上传的图片数量 */}
          {fileList.length >= 6 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}
