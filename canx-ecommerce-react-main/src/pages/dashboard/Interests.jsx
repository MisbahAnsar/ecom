import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Table, Modal, Form, InputNumber, Card, Typography, Space, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, PercentageOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';

const { Title } = Typography;

const Interests = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [form] = Form.useForm();
    const [editingInterest, setEditingInterest] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/product/interest/all`);
                setData(response.data.data);
            } catch (error) {
                toast.error('Error loading interests');
                console.error('Error fetching interests:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const openModal = (record = null) => {
        if (record) {
            setIsEditMode(true);
            setEditingInterest(record);
            form.setFieldsValue({
                paymentStart: record.paymentStart,
                paymentEnd: record.paymentEnd,
                interest: record.interest,
            });
        } else {
            setIsEditMode(false);
            form.resetFields();
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (values) => {
        try {
            if (isEditMode) {
                await axios.put(`${import.meta.env.VITE_SERVER_URL}/product/interest/update/${editingInterest._id}`, values);
                setData((prev) =>
                    prev.map((item) =>
                        item._id === editingInterest._id ? { ...item, ...values } : item
                    )
                );
                toast.success('Interest updated successfully');
            } else {
                const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/product/interest/add`, values);
                setData((prev) => [...prev, response.data.data]);
                toast.success('Interest created successfully');
            }
            setIsModalOpen(false);
        } catch (error) {
            toast.error(`Failed to ${isEditMode ? 'update' : 'create'} interest`);
            console.error('Error saving interest:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${import.meta.env.VITE_SERVER_URL}/product/interest/delete/${id}`);
            setData((prev) => prev.filter((item) => item._id !== id));
            toast.success('Interest deleted successfully');
        } catch (error) {
            toast.error('Failed to delete interest');
            console.error('Error deleting interest:', error);
        }
    };

    const columns = [
        {
            title: 'Day Range Start (Days)',
            dataIndex: 'paymentStart',
            key: 'paymentStart',
            render: (text) => <span className="font-medium">{text}</span>,
        },
        {
            title: 'Day Range End (Days)',
            dataIndex: 'paymentEnd',
            key: 'paymentEnd',
            render: (text) => <span className="font-medium">{text}</span>,
        },
        {
            title: 'Interest Rate (%)',
            dataIndex: 'interest',
            key: 'interest',
            render: (text) => (
                <span className="font-medium text-orange-600">{text}%</span>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => openModal(record)}
                        className="text-blue-600 hover:text-blue-800"
                    >
                        Edit
                    </Button>
                    <Popconfirm
                        title="Delete Interest"
                        description="Are you sure you want to delete this interest rate?"
                        onConfirm={() => handleDelete(record._id)}
                        okText="Yes"
                        cancelText="No"
                        okButtonProps={{ danger: true }}
                    >
                        <Button
                            type="link"
                            danger
                            icon={<DeleteOutlined />}
                        >
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <Card className="shadow-md">
            <div className="flex items-center justify-between mb-6">
                <Space align="center">
                    <PercentageOutlined className="text-2xl text-orange-600" />
                    <Title level={3} style={{ margin: 0 }}>
                        Interest Rates
                    </Title>
                </Space>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => openModal()}
                    size="large"
                    className="bg-blue-600"
                >
                    Add New Interest Rate
                </Button>
            </div>

            <Table
                dataSource={data}
                columns={columns}
                rowKey="_id"
                loading={loading}
                pagination={{
                    pageSize: 5,
                    showTotal: (total) => `Total ${total} items`,
                    showSizeChanger: true,
                    showQuickJumper: true,
                }}
                className="shadow-sm"
                bordered
            />

            <Modal
                title={
                    <Space>
                        {isEditMode ? <EditOutlined /> : <PlusOutlined />}
                        <span>{isEditMode ? 'Edit Interest Rate' : 'Add New Interest Rate'}</span>
                    </Space>
                }
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={() => {
                    form.validateFields()
                        .then((values) => {
                            handleSubmit(values);
                        })
                        .catch((info) => {
                            console.error('Validate Failed:', info);
                        });
                }}
                okText={isEditMode ? 'Update' : 'Create'}
                width={500}
            >
                <Form
                    form={form}
                    layout="vertical"
                    className="mt-4"
                >
                    <Form.Item
                        name="paymentStart"
                        label="Payment Start (Days)"
                        rules={[
                            { required: true, message: 'Please enter the payment start!' },
                            { type: 'number', min: 0, message: 'Must be a positive number!' }
                        ]}
                    >
                        <InputNumber
                            min={0}
                            placeholder="Enter payment start (days)"
                            style={{ width: '100%' }}
                            size="large"
                        />
                    </Form.Item>
                    <Form.Item
                        name="paymentEnd"
                        label="Payment End (Days)"
                        rules={[
                            { required: true, message: 'Please enter the payment end!' },
                            { type: 'number', min: 0, message: 'Must be a positive number!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('paymentStart') < value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('End days must be greater than start days!'));
                                },
                            }),
                        ]}
                    >
                        <InputNumber
                            min={0}
                            placeholder="Enter payment end (days)"
                            style={{ width: '100%' }}
                            size="large"
                        />
                    </Form.Item>
                    <Form.Item
                        name="interest"
                        label="Interest Rate (%)"
                        rules={[
                            { required: true, message: 'Please enter the interest rate!' },
                            { type: 'number', min: 0, max: 100, message: 'Interest rate must be between 0 and 100!' }
                        ]}
                    >
                        <InputNumber
                            min={0}
                            max={100}
                            placeholder="Enter interest rate (%)"
                            style={{ width: '100%' }}
                            size="large"
                            formatter={value => `${value}%`}
                            parser={value => value.replace('%', '')}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
};

export default Interests;