import SmoothScroll from "@/components/SmoothScroll";
import InvitationGate from "@/components/InvitationGate";
import OrnateFrame from "@/components/OrnateFrame";
import Cursor from "@/components/Cursor";
import Petals from "@/components/Petals";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Countdown from "@/components/Countdown";
import Story from "@/components/Story";
import ComingSoon from "@/components/ComingSoon";
import Gallery from "@/components/Gallery";
import Rsvp from "@/components/Rsvp";
import Footer from "@/components/Footer";
import { getParty } from "@/app/actions";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ t?: string }>;
}) {
  const { t } = await searchParams;
  const token = t ?? null;
  const party = token ? await getParty(token) : null;

  return (
    <>
      <InvitationGate />
      <OrnateFrame />
      <Cursor />
      <Petals />
      <Nav />
      <SmoothScroll>
        <main id="top" className="relative z-20">
          <Hero />
          <Countdown />
          <Story />
          <ComingSoon />
          <Gallery />
          <Rsvp token={token} party={party} />
        </main>
        <Footer />
      </SmoothScroll>
    </>
  );
}
