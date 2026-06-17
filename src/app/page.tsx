import SmoothScroll from "@/components/SmoothScroll";
import InvitationGate from "@/components/InvitationGate";
import OrnateFrame from "@/components/OrnateFrame";
import Cursor from "@/components/Cursor";
import Petals from "@/components/Petals";
import Hero from "@/components/Hero";
import Countdown from "@/components/Countdown";
import Footer from "@/components/Footer";

export default function Page() {
  return (
    <>
      <InvitationGate />
      <OrnateFrame />
      <Cursor />
      <Petals />
      <SmoothScroll>
        <main id="top" className="relative z-20">
          <Hero />
          <Countdown />
        </main>
        <Footer />
      </SmoothScroll>
    </>
  );
}
