import { Language } from './types';

export const translations: Record<Language, Record<string, string>> = {
  pt: {
    // General SaaS Info
    appName: "Smart Booking Cloud",
    slogan: "Agendamentos Simplificados.",
    perfectFor: "Ideal para clínicas, dentistas, salões de beleza, advogados, consultores, coaches, academias, estúdios de tatuagem e mecânicas.",
    langSelect: "Idioma",
    themeSelect: "Tema",
    roleSelect: "Nível de Acesso",
    companySelect: "Empresa Ativa",
    
    // Roles
    Administrator: "Administrador",
    Manager: "Gerente",
    Employee: "Funcionário",
    Customer: "Cliente",

    // Navigation
    navDashboard: "Painel Geral",
    navCalendar: "Calendário",
    navServices: "Serviços",
    navCustomers: "Clientes",
    navProfessionals: "Profissionais",
    navNotifications: "Notificações",
    navWaitlist: "Fila de Espera",
    navClientPortal: "Portal do Cliente",
    navAdminPanel: "Painel Admin",
    navApiDocs: "Documentação API",

    // Dashboard Items
    dashTitle: "Painel de Controle",
    dashTodayAppointments: "Agendamentos de Hoje",
    dashRevenue: "Faturamento Total",
    dashCustomersCount: "Total de Clientes",
    dashProfessionalsCount: "Profissionais Ativos",
    dashMonthlyIncome: "Receita Mensal",
    dashTopCustomers: "Principais Clientes",
    dashMostRequestedServices: "Serviços Mais Procurados",
    dashRecentAppointments: "Compromissos Recentes",
    dashPlatformOverview: "Visão Geral da Plataforma",
    
    // Buttons & Form Fields
    btnSave: "Salvar",
    btnCancel: "Cancelar",
    btnEdit: "Editar",
    btnDelete: "Excluir",
    btnRegister: "Cadastrar",
    btnLoading: "Carregando...",
    btnSyncGoogle: "Sincronizar Google Calendar",
    btnGoogleSynced: "Sincronizado com Google",
    btnSendReminder: "Enviar Lembrete",
    btnPay: "Pagar Agora",
    btnDownloadReceipt: "Baixar Recibo",
    btnRegisterCompany: "Criar Conta SaaS",
    btnApplyCoupon: "Aplicar Cupom",
    btnBookNow: "Agendar Online",
    btnAskAi: "Pedir Análise da IA",

    // Auth & Forms
    authLogin: "Entrar no Sistema",
    authRegister: "Registrar Minha Empresa",
    authEmail: "E-mail",
    authPassword: "Senha",
    authCompanyName: "Nome da Empresa",
    authPlanSelection: "Selecione o Plano",
    authVerifyEmail: "Verificar E-mail",
    authEmailVerified: "E-mail Verificado com Sucesso!",
    authVerifyCodeSent: "Código de verificação enviado por e-mail.",
    authGoogleLogin: "Entrar com o Google",
    authForgotPassword: "Esqueceu a senha?",
    authCreateAccount: "Criar conta",
    authSubmitting: "Enviando...",
    
    // Settings / Availability
    duration: "Duração (min)",
    price: "Preço (R$)",
    availability: "Disponibilidade",
    activeServices: "Serviços Disponíveis",
    workingDays: "Dias de Funcionamento",
    hours: "Horários",

    // Notifications / Reminders
    notifAutomaticConfirm: "Confirmação Automática Ativa",
    notifWhatsapp: "Lembrete de WhatsApp",
    notifEmail: "Lembrete de E-mail",
    notifSms: "Lembrete de SMS",
    notifStatus: "Status do Lembrete",
    notifLogTitle: "Registro de Notificações Enviadas",
    
    // Calendar & Booking
    calNewAppointment: "Novo Agendamento",
    calCustomer: "Cliente",
    calProfessional: "Profissional",
    calService: "Serviço",
    calDate: "Data",
    calTime: "Hora",
    calStatus: "Status",
    calRecurring: "Agendamento Recorrente",
    calRecurrenceRule: "Frequência da Recorrência",
    calWaitingListCheckbox: "Se lotado, colocar na Fila de Espera",
    statusPending: "Pendente",
    statusConfirmed: "Confirmado",
    statusCancelled: "Cancelado",
    ruleWeekly: "Semanal",
    ruleBiweekly: "Quinzenal",
    ruleMonthly: "Mensal",

    // Waitlist
    waitlistTitle: "Fila de Espera Ativa",
    waitlistAdd: "Adicionar à Fila",
    waitlistPreferredTime: "Horário Preferencial",
    waitlistNotifyAvailable: "Notificar Vaga",

    // Customer Portal
    portalTitle: "Portal do Cliente",
    portalHistory: "Histórico de Agendamentos",
    portalInvoices: "Faturas e Pagamentos",
    portalReceipts: "Recibos para Download",
    portalPayWith: "Forma de Pagamento",
    portalPaymentSuccess: "Pagamento efetuado com sucesso!",
    portalInvoicePaid: "Paga",
    portalInvoiceUnpaid: "Pendente",

    // SaaS Plans
    planStarter: "Iniciante",
    planProfessional: "Profissional",
    planEnterprise: "Corporativo",
    planStarterDesc: "Ideal para profissionais liberais autónomos.",
    planProfessionalDesc: "Excelente para clínicas e estúdios em crescimento.",
    planEnterpriseDesc: "Para grandes empresas com múltiplas filiais.",
    planSelectTitle: "Planos de Assinatura",
    planFeatures: "Funcionalidades incluídas",

    // Multi-company / Admin
    adminTitle: "Painel de Administração SaaS",
    adminUsers: "Gerenciar Usuários",
    adminCompanies: "Gerenciar Empresas",
    adminCoupons: "Cupons de Desconto",
    adminPlans: "Planos & Preços",
    adminReports: "Relatórios Globais do SaaS",
    adminCreateCoupon: "Criar Novo Cupom",
    adminCouponCode: "Código do Cupom",
    adminDiscountValue: "Valor do Desconto",
    adminActiveCompanies: "Empresas Ativas na Nuvem",
    adminMultiDbNote: "Nota Técnica: Cada empresa possui isolamento total de banco de dados na infraestrutura do Smart Booking Cloud.",

    // AI Section
    aiInsightsTitle: "Assistente de Negócios IA - Gemini",
    aiGenerateInsights: "Gerar Relatório Inteligente",
    aiPlaceholder: "A IA irá analisar seus faturamentos, taxas de cancelamento e serviços mais buscados para sugerir melhorias de preços e promoções..."
  },
  en: {
    // General SaaS Info
    appName: "Smart Booking Cloud",
    slogan: "Appointments Made Simple.",
    perfectFor: "Perfect for clinics, dentists, beauty salons, lawyers, consultants, coaches, gyms, tattoo studios, and mechanics.",
    langSelect: "Language",
    themeSelect: "Theme",
    roleSelect: "Access Level",
    companySelect: "Active Company",

    // Roles
    Administrator: "Administrator",
    Manager: "Manager",
    Employee: "Employee",
    Customer: "Customer",

    // Navigation
    navDashboard: "Dashboard",
    navCalendar: "Calendar",
    navServices: "Services",
    navCustomers: "Customers",
    navProfessionals: "Professionals",
    navNotifications: "Notifications",
    navWaitlist: "Waiting List",
    navClientPortal: "Customer Portal",
    navAdminPanel: "Admin Panel",
    navApiDocs: "API Docs",

    // Dashboard Items
    dashTitle: "SaaS Control Dashboard",
    dashTodayAppointments: "Today's Appointments",
    dashRevenue: "Total Revenue",
    dashCustomersCount: "Total Customers",
    dashProfessionalsCount: "Active Professionals",
    dashMonthlyIncome: "Monthly Income",
    dashTopCustomers: "Top Customers",
    dashMostRequestedServices: "Most Requested Services",
    dashRecentAppointments: "Recent Appointments",
    dashPlatformOverview: "Platform Overview",

    // Buttons & Form Fields
    btnSave: "Save",
    btnCancel: "Cancel",
    btnEdit: "Edit",
    btnDelete: "Delete",
    btnRegister: "Register",
    btnLoading: "Loading...",
    btnSyncGoogle: "Sync Google Calendar",
    btnGoogleSynced: "Synced with Google",
    btnSendReminder: "Send Reminder",
    btnPay: "Pay Now",
    btnDownloadReceipt: "Download Receipt",
    btnRegisterCompany: "Create SaaS Account",
    btnApplyCoupon: "Apply Coupon",
    btnBookNow: "Book Online",
    btnAskAi: "Ask AI Insights",

    // Auth & Forms
    authLogin: "Log In to System",
    authRegister: "Register My Business",
    authEmail: "Email",
    authPassword: "Password",
    authCompanyName: "Business Name",
    authPlanSelection: "Select Plan",
    authVerifyEmail: "Verify Email",
    authEmailVerified: "Email Verified Successfully!",
    authVerifyCodeSent: "Verification code sent to your email.",
    authGoogleLogin: "Sign in with Google",
    authForgotPassword: "Forgot password?",
    authCreateAccount: "Create account",
    authSubmitting: "Submitting...",

    // Settings / Availability
    duration: "Duration (min)",
    price: "Price ($)",
    availability: "Availability",
    activeServices: "Available Services",
    workingDays: "Working Days",
    hours: "Hours",

    // Notifications / Reminders
    notifAutomaticConfirm: "Automatic Confirmation Enabled",
    notifWhatsapp: "WhatsApp Reminder",
    notifEmail: "Email Reminder",
    notifSms: "SMS Reminder",
    notifStatus: "Reminder Status",
    notifLogTitle: "Sent Notifications Log",

    // Calendar & Booking
    calNewAppointment: "New Appointment",
    calCustomer: "Customer",
    calProfessional: "Professional",
    calService: "Service",
    calDate: "Date",
    calTime: "Time",
    calStatus: "Status",
    calRecurring: "Recurring Appointment",
    calRecurrenceRule: "Recurrence Frequency",
    calWaitingListCheckbox: "If fully booked, add to Waiting List",
    statusPending: "Pending",
    statusConfirmed: "Confirmed",
    statusCancelled: "Cancelled",
    ruleWeekly: "Weekly",
    ruleBiweekly: "Biweekly",
    ruleMonthly: "Monthly",

    // Waitlist
    waitlistTitle: "Active Waiting List",
    waitlistAdd: "Add to Waitlist",
    waitlistPreferredTime: "Preferred Time Range",
    waitlistNotifyAvailable: "Notify Opening",

    // Customer Portal
    portalTitle: "Customer Portal",
    portalHistory: "Appointment History",
    portalInvoices: "Invoices & Payments",
    portalReceipts: "Downloadable Receipts",
    portalPayWith: "Payment Method",
    portalPaymentSuccess: "Payment processed successfully!",
    portalInvoicePaid: "Paid",
    portalInvoiceUnpaid: "Unpaid",

    // SaaS Plans
    planStarter: "Starter",
    planProfessional: "Professional",
    planEnterprise: "Enterprise",
    planStarterDesc: "Ideal for independent professionals and freelancers.",
    planProfessionalDesc: "Excellent for growing clinics and mid-sized studios.",
    planEnterpriseDesc: "For corporate enterprises requiring multi-company setups.",
    planSelectTitle: "Subscription Plans",
    planFeatures: "Included Features",

    // Multi-company / Admin
    adminTitle: "SaaS Administrator Panel",
    adminUsers: "Manage Users",
    adminCompanies: "Manage Companies",
    adminCoupons: "Discount Coupons",
    adminPlans: "Plans & Pricing",
    adminReports: "SaaS Global Reports",
    adminCreateCoupon: "Create New Coupon",
    adminCouponCode: "Coupon Code",
    adminDiscountValue: "Discount Amount",
    adminActiveCompanies: "Active Cloud Companies",
    adminMultiDbNote: "Technical Note: Each company features total database isolation within the Smart Booking Cloud infrastructure.",

    // AI Section
    aiInsightsTitle: "AI Business Assistant - Gemini",
    aiGenerateInsights: "Generate Smart Report",
    aiPlaceholder: "The AI will analyze your revenue, cancellation rates, and top services to suggest pricing optimizations and promotions..."
  },
  es: {
    // General SaaS Info
    appName: "Smart Booking Cloud",
    slogan: "Citas Hechas Simples.",
    perfectFor: "Ideal para clínicas, dentistas, salones de belleza, abogados, consultores, entrenadores, gimnasios, estudios de tatuajes y mecánicos.",
    langSelect: "Idioma",
    themeSelect: "Tema",
    roleSelect: "Nivel de Acceso",
    companySelect: "Empresa Activa",

    // Roles
    Administrator: "Administrador",
    Manager: "Gerente",
    Employee: "Empleado",
    Customer: "Cliente",

    // Navigation
    navDashboard: "Panel de Control",
    navCalendar: "Calendario",
    navServices: "Servicios",
    navCustomers: "Clientes",
    navProfessionals: "Profesionales",
    navNotifications: "Notificaciones",
    navWaitlist: "Lista de Espera",
    navClientPortal: "Portal del Cliente",
    navAdminPanel: "Panel de Admin",
    navApiDocs: "Documentación API",

    // Dashboard Items
    dashTitle: "Panel de Control General",
    dashTodayAppointments: "Citas de Hoy",
    dashRevenue: "Facturación Total",
    dashCustomersCount: "Total de Clientes",
    dashProfessionalsCount: "Profesionales Activos",
    dashMonthlyIncome: "Ingreso Mensual",
    dashTopCustomers: "Clientes Principales",
    dashMostRequestedServices: "Servicios Más Solicitados",
    dashRecentAppointments: "Citas Recientes",
    dashPlatformOverview: "Resumen de la Plataforma",

    // Buttons & Form Fields
    btnSave: "Guardar",
    btnCancel: "Cancelar",
    btnEdit: "Editar",
    btnDelete: "Eliminar",
    btnRegister: "Registrar",
    btnLoading: "Cargando...",
    btnSyncGoogle: "Sincronizar Google Calendar",
    btnGoogleSynced: "Sincronizado con Google",
    btnSendReminder: "Enviar Recordatorio",
    btnPay: "Pagar Ahora",
    btnDownloadReceipt: "Descargar Recibo",
    btnRegisterCompany: "Crear Cuenta SaaS",
    btnApplyCoupon: "Aplicar Cupón",
    btnBookNow: "Reservar Online",
    btnAskAi: "Consultar IA",

    // Auth & Forms
    authLogin: "Iniciar Sesión",
    authRegister: "Registrar Mi Empresa",
    authEmail: "Correo electrónico",
    authPassword: "Contraseña",
    authCompanyName: "Nombre de la Empresa",
    authPlanSelection: "Seleccionar Plan",
    authVerifyEmail: "Verificar Correo",
    authEmailVerified: "¡Correo verificado con éxito!",
    authVerifyCodeSent: "Código de verificación enviado por correo.",
    authGoogleLogin: "Iniciar sesión con Google",
    authForgotPassword: "¿Olvidó su contraseña?",
    authCreateAccount: "Crear cuenta",
    authSubmitting: "Enviando...",

    // Settings / Availability
    duration: "Duración (min)",
    price: "Precio ($)",
    availability: "Disponibilidad",
    activeServices: "Servicios Disponibles",
    workingDays: "Días de Trabajo",
    hours: "Horarios",

    // Notifications / Reminders
    notifAutomaticConfirm: "Confirmación Automática Activa",
    notifWhatsapp: "Recordatorio de WhatsApp",
    notifEmail: "Recordatorio de Correo",
    notifSms: "Recordatorio de SMS",
    notifStatus: "Estado del Recordatorio",
    notifLogTitle: "Registro de Notificaciones Enviadas",

    // Calendar & Booking
    calNewAppointment: "Nueva Cita",
    calCustomer: "Cliente",
    calProfessional: "Profesional",
    calService: "Servicio",
    calDate: "Fecha",
    calTime: "Hora",
    calStatus: "Estado",
    calRecurring: "Cita Recurrente",
    calRecurrenceRule: "Frecuencia de Recurrencia",
    calWaitingListCheckbox: "Si está lleno, agregar a Lista de Espera",
    statusPending: "Pendiente",
    statusConfirmed: "Confirmado",
    statusCancelled: "Cancelado",
    ruleWeekly: "Semanal",
    ruleBiweekly: "Quincenal",
    ruleMonthly: "Mensual",

    // Waitlist
    waitlistTitle: "Lista de Espera Activa",
    waitlistAdd: "Agregar a la Lista",
    waitlistPreferredTime: "Horario Preferido",
    waitlistNotifyAvailable: "Notificar Cupo Libre",

    // Customer Portal
    portalTitle: "Portal del Cliente",
    portalHistory: "Historial de Citas",
    portalInvoices: "Facturas y Pagos",
    portalReceipts: "Recibos Descargables",
    portalPayWith: "Método de Pago",
    portalPaymentSuccess: "¡Pago procesado con éxito!",
    portalInvoicePaid: "Pagada",
    portalInvoiceUnpaid: "Pendiente",

    // SaaS Plans
    planStarter: "Iniciante",
    planProfessional: "Profesional",
    planEnterprise: "Empresarial",
    planStarterDesc: "Ideal para profesionales autónomos.",
    planProfessionalDesc: "Excelente para clínicas y estudios en crecimiento.",
    planEnterpriseDesc: "Para empresas corporativas que requieren bases de datos multiempresa.",
    planSelectTitle: "Planes de Suscripción",
    planFeatures: "Características Incluidas",

    // Multi-company / Admin
    adminTitle: "Panel de Administración SaaS",
    adminUsers: "Gestionar Usuarios",
    adminCompanies: "Gestionar Empresas",
    adminCoupons: "Cupones de Descuento",
    adminPlans: "Planes y Precios",
    adminReports: "Informes Globales SaaS",
    adminCreateCoupon: "Crear Nuevo Cupón",
    adminCouponCode: "Código del Cupón",
    adminDiscountValue: "Valor de Descuento",
    adminActiveCompanies: "Empresas Activas en la Nube",
    adminMultiDbNote: "Nota Técnica: Cada empresa posee aislamiento total de base de datos en la infraestructura de Smart Booking Cloud.",

    // AI Section
    aiInsightsTitle: "Asistente de Negocios IA - Gemini",
    aiGenerateInsights: "Generar Informe Inteligente",
    aiPlaceholder: "La IA analizará sus ingresos, tasas de cancelación y servicios más populares para sugerir estrategias de precios..."
  }
};
