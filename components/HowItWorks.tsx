import { ShoppingCart, CheckCircle, CreditCard, MapPin, Clock, QrCode, Gift, ArrowRight, Sparkles, Zap } from "lucide-react";
import { useState } from "react";

export function HowItWorks() {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const steps = [
    {
      icon: ShoppingCart,
      title: "1. Faça sua Reserva",
      description: "Escolha seus doces favoritos e preencha o formulário online com seus dados",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      icon: QrCode,
      title: "2. Pague com PIX",
      description: "Receba o QR Code PIX e faça o pagamento pelo app do seu banco",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    {
      icon: CheckCircle,
      title: "3. Confirmação Automática",
      description: "Receba confirmação instantânea assim que o pagamento for confirmado",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    },
    {
      icon: MapPin,
      title: "4. Retire no Evento",
      description: "Apresente o comprovante no stand da Cookite durante o JEPP",
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200"
    }
  ];

  const benefits = [
    {
      icon: Zap,
      title: "Pagamento Instantâneo",
      description: "PIX em segundos",
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      icon: Clock,
      title: "Confirmação Rápida",
      description: "Status em tempo real",
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      icon: Gift,
      title: "Produtos Artesanais",
      description: "Feitos com carinho",
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    }
  ];

  return (
    <section className="py-16 md:py-20 px-4 bg-gradient-to-b from-white via-[var(--color-cookite-gray)] to-white relative overflow-hidden">
      {/* Background subtle elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-24 h-24 bg-[var(--color-cookite-blue)] rounded-full opacity-5 blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-[var(--color-cookite-yellow)] rounded-full opacity-5 blur-xl"></div>
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[var(--color-cookite-blue)] to-[var(--color-cookite-yellow)] text-white px-4 py-2 rounded-full mb-6 shadow-md">
            <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <span className="font-semibold">Processo Simples</span>
          </div>
          <h2 className="mb-6 text-gray-800 text-4xl md:text-5xl lg:text-6xl font-bold">
            Como <span className="bg-gradient-to-r from-[var(--color-cookite-blue)] to-[var(--color-cookite-yellow)] bg-clip-text text-transparent">Funciona</span>
          </h2>
          <p className="text-gray-600 text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed">
            Processo simples e rápido para você garantir seus doces no JEPP com pagamento PIX instantâneo
          </p>
        </div>
        
        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 mb-20">
          {steps.map((step, index) => (
            <div 
              key={index}
              className={`group text-center animate-fade-in-up bg-white p-6 md:p-8 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 relative border border-gray-200 hover:border-[var(--color-cookite-blue)] cursor-pointer ${
                activeStep === index ? 'ring-2 ring-[var(--color-cookite-blue)] ring-opacity-30' : ''
              }`}
              style={{ animationDelay: `${index * 0.2}s` }}
              onMouseEnter={() => setActiveStep(index)}
              onMouseLeave={() => setActiveStep(null)}
            >
              {/* Connection Lines */}
              {index < steps.length - 1 && (
                <>
                  {/* Desktop Horizontal Line */}
                  <div className="hidden lg:block absolute top-1/2 -right-5 w-10 h-1 bg-gradient-to-r from-[var(--color-cookite-blue)] to-transparent opacity-60 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-x-150"></div>
                  
                  {/* Mobile Vertical Line */}
                  <div className="lg:hidden absolute -bottom-5 left-1/2 transform -translate-x-1/2 w-1 h-10 bg-gradient-to-b from-[var(--color-cookite-blue)] to-transparent opacity-60 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-y-150"></div>
                </>
              )}
              
              {/* Step Number Badge */}
              <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-r from-[var(--color-cookite-blue)] to-[var(--color-cookite-blue-hover)] text-white rounded-full flex items-center justify-center text-base font-bold shadow-md">
                {index + 1}
              </div>
              
              {/* Icon */}
              <div className={`w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br ${step.color} rounded-3xl mx-auto mb-6 md:mb-8 flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                <step.icon className="text-white w-10 h-10 md:w-12 md:h-12" />
              </div>
              
              {/* Content */}
              <h3 className="mb-4 text-gray-800 text-xl md:text-2xl font-bold group-hover:text-[var(--color-cookite-blue)] transition-colors duration-300">
                {step.title}
              </h3>
              <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                {step.description}
              </p>

              {/* Hover effect indicator */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ArrowRight className="w-6 h-6 text-[var(--color-cookite-blue)] animate-pulse" />
              </div>
            </div>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="mb-16">
          <h3 className="text-center mb-12 text-gray-800 text-3xl md:text-4xl font-bold">
            Por que escolher a <span className="bg-gradient-to-r from-[var(--color-cookite-blue)] to-[var(--color-cookite-yellow)] bg-clip-text text-transparent">Cookite</span>?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className="group text-center animate-fade-in-up bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 border-2 border-gray-100 hover:border-[var(--color-cookite-blue)] transform hover:-translate-y-1"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className={`w-16 h-16 ${benefit.bgColor} rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <benefit.icon className={`w-8 h-8 ${benefit.color}`} />
                </div>
                <h4 className="mb-3 text-gray-800 text-xl md:text-2xl font-bold leading-tight group-hover:text-[var(--color-cookite-blue)] transition-colors duration-300">
                  {benefit.title}
                </h4>
                <p className="text-gray-600 text-base leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Important Notes */}
        <div className="mb-16">
          {/* Payment Note */}
          <div className="group p-8 md:p-10 bg-gradient-to-br from-[var(--color-cookite-blue)] via-blue-200 to-blue-100 rounded-3xl text-center shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-500 relative max-w-3xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
            
            <div className="relative">
              <div className="flex flex-col md:flex-row items-center justify-center gap-3 mb-6">
                <div className="w-16 h-16 bg-white/90 rounded-2xl flex items-center justify-center shadow-lg">
                  <CreditCard className="text-[var(--color-cookite-blue)] w-8 h-8" />
                </div>
                <h3 className="text-white text-2xl md:text-3xl font-bold leading-tight">Pagamento PIX</h3>
              </div>
              <p className="text-white text-lg md:text-xl lg:text-2xl leading-relaxed font-semibold mb-4">
                <strong>Pagamento instantâneo via PIX!</strong>
              </p>
              <p className="text-blue-100 text-base md:text-lg">
                QR Code gerado automaticamente. Confirmação em tempo real.
              </p>
            </div>
          </div>
        </div>

        {/* Event Details */}
        <div className="p-8 md:p-10 bg-white rounded-3xl shadow-xl border-2 border-gray-100 hover:border-[var(--color-cookite-blue)] transition-all duration-300">
          <div className="text-center">
            <div className="flex flex-col md:flex-row items-center justify-center gap-3 mb-8">
              <div className="w-16 h-16 bg-[var(--color-cookite-blue)] rounded-2xl flex items-center justify-center shadow-lg">
                <MapPin className="text-white w-8 h-8" />
              </div>
              <h3 className="text-gray-800 text-2xl md:text-3xl font-bold leading-tight">Local e Horário</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 text-center">
              <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl">
                <h4 className="text-gray-800 font-bold mb-4 text-xl md:text-2xl">📍 Local</h4>
                <p className="text-gray-600 text-lg md:text-xl leading-relaxed">
                  Evento JEPP Sebrae<br />
                  <span className="text-[var(--color-cookite-blue)] font-bold text-xl">Stand da Cookite</span>
                </p>
              </div>
              <div className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl">
                <h4 className="text-gray-800 font-bold mb-4 text-xl md:text-2xl">🕒 Horário</h4>
                <p className="text-gray-600 text-lg md:text-xl leading-relaxed">
                  <span className="text-[var(--color-cookite-blue)] font-bold text-xl">12/09/2025</span><br />
                  09:00 às 16:00
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}