import Hero from '@/components/Hero'
import ProductSection from '@/components/ProductSection'
import OrderForm from '@/components/OrderForm'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <ProductSection />
      <OrderForm />
      <Footer />
    </main>
  )
}
