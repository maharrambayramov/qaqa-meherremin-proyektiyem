import React from 'react'
import axios from 'axios'
import { useState } from 'react'
import { useEffect } from 'react'
import { Spin, Table, Input, Space, Form, Select } from 'antd'

const Cards = () => {
  const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [value, setValue] = useState("")
    const [name, setName] = useState("")
    const [price, setPrice] = useState("")
    const [newItem, setNewItem] = useState("")
    const [categoriesProduct, setCategoriesProduct] = useState([])
    const onSearch = (value) => console.log(value);
    const { Search } = Input;

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Unit Price',
            dataIndex: 'unitPrice',
            key: 'unitPrice',
        }
    ];

    const dataSearch = data
        .filter((item) => {
            return item.name.toLowerCase().includes(value.toLowerCase())
        })
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((d) => {
            return {
                key: d.id,
                name: d.name,
                id: d.id,
                unitPrice: d.unitPrice,
            }
        });

        const selectedCateg = (value) => {
            setNewItem(value)
        }
    const handleChange = (e) => {
        setValue(e.target.value)
    };

    const selectName = (e) => {
      setName(e.target.value)
    }
    const selectPrice = (e) => {
      setPrice(e.target.value)
    }

    const getData = async () => {
        try {
            setLoading(true)
            const res = await axios.get("https://northwind.vercel.app/api/products")
            setData(res.data)
        } catch (error) {
            setError(error)
        } finally {
            setLoading(false)
        }
    }

    const getCategoriesProducts = async () => {
        try {
            const res = await axios.get("https://northwind.vercel.app/api/categories")
            setCategoriesProduct(res.data)
        } catch (error) {
            setError(error)
        }
    }

    const publishData = async (e) => {
        e.preventDefault();
        try {
            const respos = await axios.post("https://northwind.vercel.app/api/products", { name: name, unitPrice: price, categories: [newItem]})
            console.log(respos.data);
        } catch (error) {
            setError(error)
        }
    }

    useEffect(() => {
        getData();
        getCategoriesProducts();
        try {
            const respos = axios.post("https://northwind.vercel.app/api/products", { name: name, unitPrice: price, categories: [newItem] })
            console.log(respos.data);
        } catch (error) {
            setError(error)
        }
    }, [])

    if (loading) return <>
        <Spin />
    </>
    return (
        <div>

            <form onSubmit={publishData}>
                <label >name</label>
                <input type="text" value={name} onChange={selectName} />
                <label>price</label>
                <input type="number" value={price} onChange={selectPrice} />
                <Form.Item label="Select">
                    <Select onChange={selectedCateg}>
                        {categoriesProduct.map(cat => (
                            <Select.Option key={cat.id} value={cat.id}>{cat.name}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <button className='btn'>submit</button>
            </form>

            <Space direction="vertical">
                <Search
                    placeholder="input search text"
                    allowClear
                    enterButton="Search"
                    size="large"
                    onSearch={onSearch}
                    onChange={handleChange}
                />
            </Space>
            <Table columns={columns} dataSource={dataSearch} />
        </div>
  )
}

export default Cards