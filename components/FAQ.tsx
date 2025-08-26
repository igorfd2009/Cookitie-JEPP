import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";

export function FAQ() {
  const faqs = [
    {
      question: "Como funciona o sistema de pedidos online?",
      answer: "Você pode adicionar produtos ao carrinho, revisar seu pedido e finalizar a compra diretamente pelo site. O sistema gera um QR Code PIX para pagamento instantâneo e confirmação automática."
    },
    {
      question: "Quais são as formas de pagamento aceitas?",
      answer: "Aceitamos apenas PIX para pedidos online. O pagamento é processado instantaneamente e você recebe confirmação imediata. Para pedidos no evento, aceitamos PIX e dinheiro."
    },
    {
      question: "Como funciona o desconto de 20%?",
      answer: "O desconto é aplicado automaticamente para todos os pedidos feitos online até 10 de setembro de 2025. Além disso, você pode usar o cupom 'JEPP2025' para mais 5% de desconto adicional!"
    },
    {
      question: "Como funciona a retirada dos doces?",
      answer: "Após confirmar o pagamento, você receberá um código de retirada por email. Apresente este código no stand Cookite no evento JEPP entre 09:00 e 16:00 para retirar seus doces."
    },
    {
      question: "Posso alterar ou cancelar meu pedido depois de confirmado?",
      answer: "Sim! Você pode alterar seu pedido até 48h antes do evento entrando em contato pelo Instagram @cookite_oficial. Para cancelamentos, o reembolso é processado em até 24h."
    },
    {
      question: "Os doces são frescos?",
      answer: "Sim! Todos os doces são feitos artesanalmente pelos alunos participantes do JEPP na manhã do evento, garantindo máxima frescura e qualidade. Nada de produtos industrializados!"
    }
  ];

  return (
    <section className="py-12 md:py-16 px-4 bg-[var(--color-cookite-gray)]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="mb-3 md:mb-4 text-gray-800 text-2xl md:text-3xl font-bold">Perguntas Frequentes</h2>
          <p className="text-gray-600 text-sm md:text-base">
            Tire suas dúvidas sobre pedidos online, pagamentos PIX e o processo de retirada
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-3 md:space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="bg-white rounded-xl md:rounded-2xl px-4 md:px-6 shadow-sm border-0 animate-fade-in-up hover:shadow-md transition-shadow duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <AccordionTrigger className="text-left hover:no-underline py-4 md:py-6 text-sm md:text-base font-medium text-gray-800 hover:text-[var(--color-cookite-blue)] transition-colors duration-200">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pb-4 md:pb-6 text-sm md:text-base leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        
        <div className="text-center mt-8 md:mt-12">
          <p className="text-gray-600 text-sm md:text-base mb-4">
            Ainda tem dúvidas? Entre em contato conosco!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <a 
              href="https://instagram.com/cookite_oficial" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[var(--color-cookite-blue)] to-[var(--color-cookite-blue-hover)] text-white px-6 py-3 rounded-xl font-medium hover:from-[var(--color-cookite-blue-hover)] hover:to-[var(--color-cookite-blue)] transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              Instagram @cookite_oficial
            </a>
            <a 
              href="mailto:nickaasalomao@gmail.com"
              className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}