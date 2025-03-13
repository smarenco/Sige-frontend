import React, { useEffect, useState } from 'react';
import './DefaultLayouts.css';
import {
    CloseOutlined,
    DownOutlined,
    LogoutOutlined,
    MenuFoldOutlined,
    MenuOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Avatar, Button, Drawer, Dropdown, Layout, Menu, message, Space } from 'antd';
import { MENU } from '../common/consts';
import { forceLogout, hasPermission, isLogged } from '../services/AuthService';
const { Header, Sider, Content } = Layout;

const DefaultLayout = ({ component, route, app, isMobile }) => {
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false)
    const [menuVisible, setMenuVisible] = useState(false);
    const [selectedKeys, setSelectedKeys] = useState(['home']);
    let i = 0;

    useEffect(() => {
        const route = app.routes.filter(r => r.path === window.location.pathname || r.path + '/' === window.location.pathname);
        if (route.length > 0) {
            setSelectedKeys([route[0].key]);
        }
        success('Bienvenide a URUSIGE');
    }, []);

    useEffect(() => {
        if (!isLogged()) {
            navigate('/auth/login');
        }
    }, [route]);

    const handleLogout = async () => {
        forceLogout();
    }

    const handleMyProfile = () => {
        setSelectedKeys(['profile']);
        navigate('/perfil');
    }

    let menuProps = JSON.parse(localStorage.getItem(MENU));

    if (!menuProps) {
        menuProps = [];
    }

    const itemsDropdown = [
        {
            label: 'Mi Perfil',
            key: '1',
            icon: <UserOutlined />,
            onClick: handleMyProfile
        },
        {
            label: 'Cerrar Sesión',
            key: '2',
            icon: <LogoutOutlined />,
            onClick: handleLogout
        }
    ];

    const dropdownProps = {
        items: itemsDropdown
    };

    const [messageApi, contextHolder] = message.useMessage();

    const success = (message) => {
        messageApi.success(message);
    };

    const renderMenu = (menu) => {
        return menu.map((r) => {
            i++;
            if (r.IsDivider) {
                return {
                    type: 'divider',
                    dashed: 1,
                    key: r.key,
                };
            }
            if (Array.isArray(r.items)) {
                const children = renderMenu(r.items);
                if (children.filter(el => !!el).length === 0) {
                    return undefined;
                }
                i++;
                //console.log(r);

                return {
                    key: r.key,
                    icon: r?.icon,
                    label: r.title,
                    children: children,
                    disabled: !!r?.disabled
                }
            } else {
                if (!hasPermission(r.key)) {
                    return null;
                }
                const route = menuProps.filter(menu => menu.key === r.key);
                if (route.length > 0) {
                    if (!r.isPublic) {
                        return {
                            key: r.key,
                            icon: r?.icon,
                            label: <Link disabled={!!r?.disabled} to={r.to} onClick={() => setSelectedKeys([r.key])}>{r.title}</Link>,
                            disabled: r?.disabled
                        }
                    } else {
                        return null;
                    }
                } else {
                    return null;
                }

            }
        })
    }

    return (
        <Layout className="layout" style={{ overflow: 'hidden', height: '100vh' }}>
            {contextHolder}
            <Layout>
                {
                    isMobile ?
                        (
                            <Drawer
                                theme="dark"
                                placement="left"
                                closable={false}
                                onClose={() => setMenuVisible(false)}
                                open={menuVisible}
                                bodyStyle={{
                                    backgroundColor: '#001529', // color oscuro del menú
                                }}
                                width="100vw"
                            >
                                <Button
                                    type="text"
                                    icon={<CloseOutlined />}
                                    onClick={() => setMenuVisible(false)}
                                    style={{ fontSize: '20px', marginBottom: '40px', float: 'right', color: 'white' }}
                                />
                                <Menu
                                    theme="dark"
                                    mode="vertical"
                                    selectedKeys={selectedKeys}
                                    items={renderMenu(app.menu.main)}
                                    onClick={() => setMenuVisible(false)}
                                />
                            </Drawer>
                        )
                        :
                        (
                            <Sider style={{ overflow: 'auto' }} trigger={null} collapsible width={collapsed ? 0 : 270} collapsed={collapsed}>
                                <div className='logo-container'>
                                    {
                                        collapsed ?
                                            <img width={35} src={require('../../assets/logo1.png')} alt='logo-urusige' />
                                            :
                                            <img width={120} src={require('../../assets/logo2.png')} alt='logo-urusige' />
                                    }
                                </div>
                                <Menu
                                    theme="dark"
                                    mode="inline"
                                    selectedKeys={selectedKeys}
                                    defaultOpenKeys={selectedKeys}
                                    style={{ overflowX: 'auto', height: 'calc(100vh - 105px)', alignSelf: 'flex-start' }}
                                    items={renderMenu(app.menu.main)}
                                />
                            </Sider>
                        )
                }
                <Layout className="site-layout">
                    <Header
                        className="site-layout-background"
                        style={{
                            padding: 0,
                        }}
                    >
                        {
                            isMobile ?
                                (
                                    <Button
                                        type="text"
                                        icon={<MenuOutlined />}
                                        onClick={() => setMenuVisible(true)}
                                        style={{ fontSize: '20px', margin: '16px' }}
                                    />
                                )
                                :
                                (
                                    React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                                        className: 'trigger',
                                        onClick: () => setCollapsed(!collapsed),
                                    })
                                )}
                        <Space wrap style={{ float: 'right', top: 10, marginRight: 20 }}>
                            <Dropdown menu={dropdownProps} >
                                <Button type='text'>
                                    <Avatar size='small' style={{ transform: 'translateY(-2px)' }} src={require('../../assets/logo1.png')} icon={<UserOutlined />} />
                                    <DownOutlined />
                                </Button>
                            </Dropdown>
                        </Space>
                    </Header>
                    <Content
                        className="site-layout-background"
                        style={{
                            margin: '24px 16px',
                            padding: 24,
                            minHeight: window.innerHeight - 100,
                        }}
                    >
                        {component}
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};
export default DefaultLayout;