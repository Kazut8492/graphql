import logo from './logo.svg';
import './App.css';
import { useQuery } from '@apollo/client'
import UserInfo from './components/UserInfo'
import { useState, useEffect } from 'react'
import {Button, Form, Input} from 'antd'
import "antd/dist/antd.css"

const App = () => {
  const [username, setUsername] = useState("")
  const [form] = Form.useForm();

  const handleSearchSubmit = (event) => {
    setUsername(event.username)
    // reset the form when submitted
    form.resetFields();
  }

  useEffect(()=>{
    console.log(username)
  }, [username])

  return (
    <>
      <main>
        <Form onFinish={handleSearchSubmit} form={form} >
          <Form.Item
            label="Username"
            name="username"
            rules={[
              {
                required: true,
                message: 'Please input username!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type='Primary' htmlType="submit">Search</Button>
          </Form.Item>
        </Form>
        {/* <form onSubmit={handleSearchSubmit}>
          <h2>Input username: </h2>
          <input type="text" name="username" />
          <Button type='Primary'>Search</Button>
        </form> */}
        {username && <UserInfo username={username} />}
        <h2>SampleID:  Kazut61311334</h2>
      </main>
    </>
  )
}

export default App;