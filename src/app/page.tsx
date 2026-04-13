import { Header } from '@/components/jhi/Header';
import { HeroSection } from '@/components/jhi/HeroSection';
import { AboutSection } from '@/components/jhi/AboutSection';
import { CommoditiesSection } from '@/components/jhi/CommoditiesSection';
import { GlobalReachSection } from '@/components/jhi/GlobalReachSection';
import { WhyChooseSection } from '@/components/jhi/WhyChooseSection';
import { FaqSection } from '@/components/jhi/FaqSection';
import { SpeakWithTeamSection } from '@/components/jhi/SpeakWithTeamSection';
import { ContactSection } from '@/components/jhi/ContactSection';
import { Footer } from '@/components/jhi/Footer';
import { ChatWidget } from '@/components/jhi/ChatWidget';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col" suppressHydrationWarning>
      <Header />
      <main className="flex-1">
        <HeroSection />
        <AboutSection />
        <CommoditiesSection />
        <GlobalReachSection />
        <WhyChooseSection />
        <FaqSection />
        <SpeakWithTeamSection />
        <ContactSection />
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
}
