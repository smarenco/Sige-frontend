import { AimOutlined, ApartmentOutlined, BankOutlined, CarOutlined, ClockCircleOutlined, ContainerOutlined, ControlOutlined, CreditCardOutlined, DashboardOutlined, DollarCircleOutlined, ExceptionOutlined, FileDoneOutlined, FileOutlined, GoldOutlined, HddOutlined, HeartOutlined, HighlightOutlined, HomeOutlined, IdcardOutlined, MedicineBoxOutlined, OrderedListOutlined, PayCircleOutlined, ScheduleOutlined, SettingOutlined, SolutionOutlined, TeamOutlined, UsergroupAddOutlined, UserOutlined } from '@ant-design/icons';
import { createSlice } from '@reduxjs/toolkit';
import { CONFIG } from '../../common/consts';
import { AbsenteeismCausesPage } from '../../pages/administrations/AbsenteeismCausesPage';
import { AccountPage } from '../../pages/administrations/AccountPage';
import { CityPage } from '../../pages/administrations/CityPage';
import { CoursePage } from '../../pages/administrations/CoursePage';
import { DocumentCategoryPage } from '../../pages/administrations/DocumentCategoryPage';
import { DocumentPage } from '../../pages/administrations/DocumentPage';
import { GroupPage } from '../../pages/administrations/GroupPage';
import { InstitutePage } from '../../pages/administrations/InstitutePage';
import { MedicalCoveragePage } from '../../pages/administrations/MedicalCoveragePage';
import { PaymentMethodsPage } from '../../pages/administrations/PaymentMethodsPage';
import { TurnPage } from '../../pages/administrations/TurnPage';
import { UserPage } from '../../pages/administrations/UserPage';
import { LoginPage } from '../../pages/auth/LoginPage';
import { HomePage } from '../../pages/HomePage';
import { PaymentPage } from '../../pages/administrations/PaymentPage';
import { UserProfilePage } from '../../pages/administrations/UserProfilePage';
import { AccountPaymentPage } from '../../pages/administrations/AccountPaymentPage';
import { AttendanceAdminPage } from '../../pages/administrations/attendance/AttendanceAdminPage';

import { ConsultExpiredDocumentPage } from '../../pages/consults/ConsultExpiredDocumentPage';
import { ConsultPaymentPage } from '../../pages/consults/ConsultPaymentPage';
import { MyAttendancePage } from '../../pages/administrations/attendance/MyAttendancePage';
import { EvaluationPage } from '../../pages/administrations/EvaluationPage';
import { MyEvaluationsPage } from '../../pages/administrations/MyEvaluationPage';



export const appStore = createSlice({
    name: 'app',
    initialState: {
        params: {

        },
        session: {

        },
        routes: [
            { key: 'home', name:'Home', path: '/', component: HomePage },
            // Sesión
            { key: 'chkLogin', path: '/auth', component: LoginPage, isPublic: true, clean: true },
            { key: 'profile', name: 'Perfil', path: '/perfil', component: UserProfilePage },
            { key: 'adm-cities', name: 'Ciudades', path: '/ciudades', component: CityPage },
            { key: 'adm-medicalCoverage', name: 'Coberturas Medicas', path: '/coberturas-medicas', component: MedicalCoveragePage },
            { key: 'adm-courses', name: 'Cursos', path: '/cursos', component: CoursePage },
            { key: 'adm-instituts', name: 'Institutos', path: '/institutos', component: InstitutePage },
            { key: 'adm-absenteeismCauses', name: 'Causas de ausentismos', path: '/causas-ausentismos', component: AbsenteeismCausesPage },
            { key: 'adm-documentCategory', name: 'Categorias de documentos', path: '/categorias-documentos', component: DocumentCategoryPage },
            { key: 'adm-turn', name: 'Turnos', path: '/turnos', component: TurnPage },
            { key: 'adm-payment', name: 'Pagos', path: '/pago', component: PaymentPage },
            { key: 'adm-paymentMethods', name: 'Metodos de pago', path: '/metodos-pago', component: PaymentMethodsPage },
            { key: 'adm-group', name: 'Grupos', path: '/grupos', component: GroupPage },
            { key: 'adm-evaluation', name: 'Evaluaciones', path: '/evaluaciones', component: EvaluationPage },
            { key: 'adm-document', name: 'Documentos', path: '/documentos', component: DocumentPage },
            { key: 'cons-consult-payment', name: 'Pagos', path: '/consulta-pagos', component: ConsultPaymentPage },
            { key: 'cons-expired-document', name: 'Documentacion con vencimiento', path: '/consulta-documentacion', component: ConsultExpiredDocumentPage },
            { key: 'conf-users', name: 'Usuarios', path: '/usuarios', component: UserPage },
            { key: 'conf-account', name: 'Cuenta', path: '/cuenta', component: AccountPage },
            { key: 'conf-accountPayment', name: 'Pagos Cuenta', path: '/pago-cuenta', component: AccountPaymentPage },
            { key: 'attendance-overview', name:'Panel asistencia', path: '/attendance/overview', component: CoursePage },
            { key: 'attendance-teacher-lists', name:'Listas docentes', path: '/attendance/teacher-lists', component: AttendanceAdminPage },
            { key: 'attendance-admin', name:'Asistencia', path: '/attendance/admin', component: AttendanceAdminPage },
            { key: 'my-attendance', name:'Mi asistencia', path: '/my-attendance', component: MyAttendancePage },
            { key: 'my-evaluation', name:'Mi evaluación', path: '/my-evaluation', component: MyEvaluationsPage },
            // /// Configuración
            // { key: 'auditoria', path: '/auditoria', component: Auditoria },
            // { key: 'auditoria-detail', path: '/auditoria/:id', component: AuditoriaDetalle, keysPage: ['id'] },
        ], // 'authenticated', 'not-authenticated'
        menu: {
            main: [
                // { key: '', to: '', icon: '', text: '', title: '', items: [] },
                { key: 'home', to: '/', icon: <HomeOutlined />, title: 'Home'},
                // { key: 'profile', to: '/perfil', icon: <SolutionOutlined />, title: 'Perfil'}, comentado porque ya esta en fotito de usuario
                { key: 'my-attendance', to: '/my-attendance', icon: <OrderedListOutlined />, title: 'Mi asistencia'},
                { key: 'my-evaluation', to: '/my-evaluation', icon: <FileDoneOutlined />, title: 'Mi evaluación'},
                { key: 'IsDivider', IsDivider: true},
                {
                    key: 'adm-administrations', icon: <HomeOutlined />, title: 'Administracion' , items: [
                        { key: 'adm-documentCategory', to: '/categorias-documentos', icon: <ExceptionOutlined />, title: 'Categorias de documentos'},
                        { key: 'adm-absenteeismCauses', to: '/causas-ausentismos', icon: <ScheduleOutlined />, title: 'Causas de ausentismos'},
                        { key: 'adm-cities', to: '/ciudades', icon: <AimOutlined />, title: 'Ciudades'},
                        { key: 'adm-medicalCoverage', to: '/coberturas-medicas', icon: <CarOutlined />, title: 'Coberturas medicas'},
                        { key: 'adm-courses', to: '/cursos', icon: <ContainerOutlined />, title: 'Cursos'},
                        { key: 'adm-document', to: '/documentos', icon: <FileOutlined />, title: 'Documentos'},
                        { key: 'adm-group', to: '/grupos', icon: <GoldOutlined />, title: 'Grupos'},
                        { key: 'adm-evaluation', to: '/evaluaciones', icon: <HighlightOutlined />, title: 'Evaluaciones'},
                        { key: 'adm-instituts', to: '/institutos', icon: <BankOutlined />, title: 'Institutos'},
                        { key: 'adm-paymentMethods', to: '/metodos-pago', icon: <CreditCardOutlined />, title: 'Metodos de pago'},
                        { key: 'adm-payment', to: '/pago', icon: <DollarCircleOutlined />, title: 'Pagos'},
                        { key: 'adm-turn', to: '/turnos', icon: <ContainerOutlined />, title: 'Turnos'},
                        { key: 'adm-attendance', icon: <ContainerOutlined />, title: 'Asistencia', items: [
                            { disabled: true, key: 'attendance-overview', to: '/attendance/overview', icon: <DashboardOutlined />, title: 'Resumen'},
                            { disabled: true, key: 'attendance-teacher-lists', to: '/attendance/teacher-lists', icon: <OrderedListOutlined />, title: 'Listas docentes'},
                            { key: 'attendance-admin', to: '/attendance/admin', icon: <TeamOutlined />, title: 'Administracion de asistencia'},
                        ]},
                    ]
                },
                {
                    key: 'conf-consults', icon: <SettingOutlined />, title: 'Consultas', items: [
                        { key: 'cons-consult-payment', to: '/consulta-pagos', icon: <CreditCardOutlined />, title: 'Consulta pagos'}, 
                        { key: 'cons-expired-document', to: '/consulta-documentacion', icon: <TeamOutlined />, title: 'Consulta Documentacion'},
                    ]
                },
                {
                    key: 'conf-config', icon: <SettingOutlined />, title: 'Configuracion', items: [
                        { key: 'conf-account', to: '/cuenta', icon: <ControlOutlined />, title: 'Cuenta'},
                        { key: 'conf-accountPayment', to: '/pago-cuenta', icon: <DollarCircleOutlined />, title: 'Pagos cuentas'},
                        { key: 'conf-users', to: '/usuarios', icon: <TeamOutlined />, title: 'Usuarios'},
                    ]
                }
            ],
            mainRight: [
                { key: 'logout', to: '/auth/logout', icon: 'logout', title: 'Cerrar sesión' },
            ],
        },

        config: JSON.parse(localStorage.getItem(CONFIG) || '{}'),
        
    },
    reducers: {
        getParams(state){
            
            /*loadParams().then(params => {
                localStorage.setItem('params', JSON.stringify(params));
                state.params = { ...params }
            });*/
        }         
    }
})


export const { getParams } = appStore.actions;