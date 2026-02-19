"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { Creative } from "@/types";
import trelloData from "@/50-formatos-anuncios.json";
import CreativeCardV2 from "@/components/v2/CreativeCardV2";
import CreativeModalV2 from "@/components/v2/CreativeModalV2";

// Mapeamento de exemplos embeddáveis (IDs do Google Drive)
const EXAMPLES_MAP: Record<number, { id: string; name: string; type: "video" | "image" }[]> = {
  1: [
    { id: "1depRw5BrLJSbBLo6i6-AKPiuRAt_hYyO", name: "F1.1.mp4", type: "video" },
    { id: "1a2JaFHx0sWYP2GsHWlR-37Cy8Qh_Oh1-", name: "F1.2.mp4", type: "video" },
    { id: "14n7y5j47TxsaYwVtLtWzYZWAXXW6nL0f", name: "F1.3.mp4", type: "video" },
  ],
  2: [
    { id: "1a6mxXfXrGC1nUc7my8tTYZBgDSpr05JZ", name: "F2.1.mp4", type: "video" },
    { id: "1R3pDJe_cDm56VGTXmVvRQxAiFDHjM1j_", name: "F2.2.mp4", type: "video" },
  ],
  3: [
    { id: "1ZwZByFT0xICaLn_LZK0nTDRlHFzIyRsZ", name: "F3.1.mp4", type: "video" },
    { id: "1SA7A6CVCekjb7YLxL_SQf3KSfbVeO5mq", name: "F3.2.mp4", type: "video" },
    { id: "1p9ij8xAEehSQG2Jttjrz9t52ubhUi3rp", name: "F3.3.mp4", type: "video" },
    { id: "1eixOrAxqV9KQRdrJjvxy21ej9IwiT1r1", name: "F3.4.mp4", type: "video" },
    { id: "1kkAGzWTZz4uInI319w86RZh0LUg-Azn_", name: "F3.5.mp4", type: "video" },
  ],
  4: [
    { id: "1u6qu7yboy5IOawHtDRHjj-VYI6ZO-Ztq", name: "F4.1.mp4", type: "video" },
    { id: "1Tjd2_iQPRONynge2IjH7s0y_gNvaosxK", name: "F4.2.mp4", type: "video" },
  ],
  5: [
    { id: "1U99g7IJL_O-NoSA4WLhFX7c1_PswoeJ-", name: "F5.1.jpg", type: "image" },
    { id: "1zwCkP-1rRNB2VeOxBdyX12tzZlhmN_XT", name: "F5.2.jpg", type: "image" },
  ],
  6: [
    { id: "1OVep5vhZtsenWdEdBa5MR3-2cJ0_h1lO", name: "F6.1.mp4", type: "video" },
    { id: "1MmJsrVKTpHNiBkOp3ayMhzJOE-fp_fpg", name: "F6.2.mp4", type: "video" },
  ],
  7: [
    { id: "1ftcOrUT37XIBpe9ir8o7ts_F-7Mc7I0e", name: "F7.1.mp4", type: "video" },
    { id: "1OFG_d7737DOmtrKBjoSby2yJ_rGl_lwz", name: "F7.2.mp4", type: "video" },
  ],
  8: [
    { id: "1_tGJMh1lPNGO-siYcxaV8q9HE5p8mECo", name: "F8.1.mp4", type: "video" },
    { id: "1cG_djB9D2fclDvWV_eFG_53aVi2eciKO", name: "F8.2.mp4", type: "video" },
  ],
  9: [
    { id: "10x_TfqBiO2GWgwMgdBK-KUW4Dl7-wF2_", name: "F9.1.mp4", type: "video" },
    { id: "1_fjb8R7wKP5GkViUZ0Um_ZxTMpXCUjUZ", name: "F9.2.mp4", type: "video" },
    { id: "1Zf9XZGRExegLtIjMDlHSkAUo2XaT1PcX", name: "F9.3.mp4", type: "video" },
    { id: "1IgWFpIpHkKAJ5cYtsyfIShaTfBqTC7qL", name: "F9.4.mp4", type: "video" },
  ],
  10: [
    { id: "13vy8lFoPrO8j4-WfmtkbCt-Nxd9M4ktr", name: "F10.1.mp4", type: "video" },
    { id: "1skEu613BXwF0IXgQZo2aGedJz2kE5ovy", name: "F10.2.mp4", type: "video" },
  ],
  11: [
    { id: "1QYd6rSvtlrEvMhXMapVIF9A0Yb5ovkE9", name: "F11.1.mp4", type: "video" },
    { id: "171jcQ0_YTtUcQSUyMYAbLxuLz-KUU29i", name: "F11.2.mp4", type: "video" },
  ],
  12: [
    { id: "1vlqqJl2A9IAWoFohVmVIk24jbyCXhdlC", name: "F12.1.mp4", type: "video" },
    { id: "1RpSg5lm6MySVZiuTqyFOp3a_8jTlvQCe", name: "F12.2.mp4", type: "video" },
    { id: "1IjHzvdVkeMZ8F_Hijf8JRlCb61SeaeyY", name: "F12.3.mp4", type: "video" },
  ],
  13: [
    { id: "1RZ48hG4MLvKtezzTo_m1Y-6AZHbiPGE4", name: "F13.1.mp4", type: "video" },
    { id: "10oI_78WhSEQ2SBQyqFEnwqzc4_GzBHzh", name: "F13.2.mp4", type: "video" },
    { id: "12uX8eaND8Niyx5QkReAMSx3NdqJTIziG", name: "F13.3.mp4", type: "video" },
    { id: "1Y84thBvxA0PzyOyi4-SuVryP0PdcJoT5", name: "F13.4.mp4", type: "video" },
    { id: "1pc4OvMIkQyZpToO2GD0-joz7PvvbD3h2", name: "F13.5.mp4", type: "video" },
  ],
  14: [
    { id: "18SBND0vEIHcjfbbfHK533OWkGU5a1Y1O", name: "F14.1.mp4", type: "video" },
    { id: "1NnnuPni1Fch9q7EMv-icvK8k46y3LZ9W", name: "F14.2.mp4", type: "video" },
    { id: "1up6vzEbTtMQxc6eLgTQ48iIWVMqbyHfr", name: "F14.3.mp4", type: "video" },
  ],
  15: [
    { id: "1Bg0XIfqnaEY_C7AvN1FDrNdBxg1Fjz8t", name: "F15.1.mp4", type: "video" },
    { id: "1W1tyu3s7vFLchnkglfZY-xe3WeQ-umMh", name: "F15.2.mp4", type: "video" },
    { id: "1U_AMh7EgLo3rA3XdZxPdOz62lKHReejZ", name: "F15.3.mp4", type: "video" },
    { id: "11ZKQpesxHa7xczIPKC1n9RtJWaHIg0zj", name: "F15.4.mp4", type: "video" },
  ],
  16: [
    { id: "1IZcw-FybVJrYZ1sLMT7rm-0YbXMZ-F9y", name: "F16.1.mp4", type: "video" },
    { id: "1fJbNreXt09vuCFiTAuJh7mzOlS1UOupQ", name: "F16.2.mp4", type: "video" },
    { id: "11SaeTzQbVT9k6wLwCeEMzKhzsTiYEd-A", name: "F16.3.mp4", type: "video" },
    { id: "1ek2tDciOsF-LKmEBZfP8CxTxbLE0BfuY", name: "F16.4.mp4", type: "video" },
  ],
  17: [
    { id: "1QCTnp4-lY2rR3lObbkvPKZ-r5Rc9bWvS", name: "F17.1.mp4", type: "video" },
    { id: "1XMgvcRrsCPbgw0auhglJQ_B04QRVKIBP", name: "F17.2.mp4", type: "video" },
  ],
  18: [
    { id: "1V7wjiE3CVfhAXoEjmZFIZElHF_ToKVNR", name: "F18.1.mp4", type: "video" },
    { id: "1KBiZyyTTbIyc78X3SPdBZ6uGqNQFNAMP", name: "F18.2.mp4", type: "video" },
  ],
  19: [
    { id: "19XX2efPPZk8k7JG2khRTcEKWlQ09F6Dx", name: "F19.1.mp4", type: "video" },
    { id: "1eJCQtMaGTcYwdhrmeePdZdWms4YgnUDT", name: "F19.2.mp4", type: "video" },
  ],
  20: [
    { id: "1nkj_Pml9w4aRdRvqHpewcNkOJc9ix4zs", name: "F20.1.mp4", type: "video" },
    { id: "1wi52dLg-l84nUYFnoNdndpyDN63b_hb6", name: "F20.2.mp4", type: "video" },
  ],
  21: [
    { id: "1EK56MtYOSauEv5YN1VihThwc5HQI9GLY", name: "F21.1.mp4", type: "video" },
    { id: "1H61Gu6Eq7j0QRpZHo2HUkaG-cg56D6Qd", name: "F21.2.mp4", type: "video" },
  ],
  22: [
    { id: "1_Nz4VlMIHge3uUp0qii7zZgUIteKTkSI", name: "F22.1.mp4", type: "video" },
    { id: "1BYsm4Zoktt0g2U3evvqz22OJP0sgNWR0", name: "F22.2.mp4", type: "video" },
  ],
  23: [
    { id: "1dt2Y4j2Qs3JlDJsJkESLLfrZUr2_GJ08", name: "F23.1.mp4", type: "video" },
    { id: "1VtDydGzrlpfV_hAWlCvg3MVc_im6LqL-", name: "F23.2.mp4", type: "video" },
  ],
  24: [
    { id: "11HEBmH5O9-eQ9pFrjAyqd8ZS66Bu8WwV", name: "F24.1.mp4", type: "video" },
    { id: "16F62xfvtkabY2jCNyLTJnj5r5G4fLZIT", name: "F24.2.mp4", type: "video" },
    { id: "1OqL0b8UaZ0606BPMoPdyWPCsB1p4N3vq", name: "F24.3.mp4", type: "video" },
  ],
  25: [
    { id: "1zXmgHpsp2GrSozNX00rQxugXkEiM5x1o", name: "F25.1.mp4", type: "video" },
    { id: "11k8fvWimy3xsfzgwDKIqOd7-FFbrjqEu", name: "F25.2.mp4", type: "video" },
    { id: "1xU3SpW1wk06XYsbsHqnFiT_i1XkL_M9D", name: "F25.3.mp4", type: "video" },
  ],
  26: [
    { id: "1xQ21X9U0_L_krAZH10CXsriiKDU51TvY", name: "F26.1.mp4", type: "video" },
    { id: "113JMZvPKECL-iGn9SmPpUxvqqyMj3m-p", name: "F26.2.mp4", type: "video" },
  ],
  27: [
    { id: "1QiMO2_U5wSvEq_D1QjCHu7dYNO238mS8", name: "F27.1.mp4", type: "video" },
    { id: "1w3fI9m3e4zCbRbdtqBweHCyUtr872T4z", name: "F27.2.mp4", type: "video" },
  ],
  28: [
    { id: "1pPHiRjG0Ekbz9rXrKSx7TviFhinWJxgj", name: "F28.1.mp4", type: "video" },
    { id: "1IMNWCXeqFbJyQmAXWA3iedkqdqVbJ0B3", name: "F28.2.png", type: "image" },
    { id: "19MTWTqMkBK1MHsM3Eef8VbLNM5ZqRwB5", name: "F28.3.png", type: "image" },
  ],
  29: [
    { id: "1qA_TlRdbM5RhWbeA2di0gsUlTih-pDbl", name: "F29.1.mp4", type: "video" },
    { id: "1tLJyEqoK9rqXmIIeMfGNCfgqMRBURFq8", name: "F29.2.mp4", type: "video" },
  ],
  30: [
    { id: "1nK1G8TYPFpvy0w0ly_j4e5_PyFxBmh65", name: "F30.1.mp4", type: "video" },
  ],
  31: [
    { id: "1SyLqXN63mEoP8XyxNJ-m60oWoYqIDyIo", name: "F31.1.mp4", type: "video" },
    { id: "1ARafUYdPNyUy7LDzIOvFd282JO-ZGOVj", name: "F31.2.mp4", type: "video" },
  ],
  32: [
    { id: "1UcVRuME-dpef9EuAfG671SKUewrmO2KP", name: "F32.1.mp4", type: "video" },
    { id: "1uRkQla2foF_855je5hegUMewIvC-_aJS", name: "F32.2.mp4", type: "video" },
  ],
  33: [
    { id: "1P4M9ePJXBaJUOrIujjoWoQAlELj59ZkH", name: "F33.1.mp4", type: "video" },
    { id: "1hSBsP52osXsJNoxkMqFPuZeRXb-wn9VN", name: "F33.2.mp4", type: "video" },
  ],
  34: [
    { id: "1rdTUk5c3jFeOkQ_IabBRKx4N0J2Pnv7l", name: "F34.1.mp4", type: "video" },
    { id: "1nY51g_-6DT94QD3NFRj4hogAVY5iqNWi", name: "F34.2.mp4", type: "video" },
  ],
  35: [
    { id: "1B4UUIPZD8NOI5DIXDmGPXn_0tCgAlB7H", name: "F35.1.mp4", type: "video" },
    { id: "1FYuPuJO3erxTUmz6ZXZHY7410a7DXV_3", name: "F35.2.mp4", type: "video" },
  ],
  36: [
    { id: "156v1-O_YGJT24h02Inc8QJ2atc3A_5u9", name: "F36.1.jpg", type: "image" },
    { id: "1M1K8bDibpbIs8JdJhqiQOhZnx2owvykv", name: "F36.2.mp4", type: "video" },
  ],
  37: [
    { id: "1tMEXRCklNiqberMU9ZWd6a7uj6OT7m_Y", name: "F37.1.jpg", type: "image" },
    { id: "14vu2Xp_2hEJLaH0ev1yAcQ-QfeE1v9VB", name: "F37.2.jpg", type: "image" },
  ],
  38: [
    { id: "1x-eKLYTH9girqSl5eE-2xPLI1g4Dhxso", name: "F38.1.png", type: "image" },
    { id: "165LtN3Y9tGsXQrT8L6W_IKawzpw3sMws", name: "F38.2.png", type: "image" },
  ],
  39: [
    { id: "1jZpgUsD9oH9KbSdi9fRI48pBIQswIWir", name: "F39.1.mp4", type: "video" },
    { id: "1fnl_k7zXOcIDWc90RkCY27UNzSvKLf2e", name: "F39.2.mp4", type: "video" },
  ],
  40: [
    { id: "1McgtoZpysL9_E7sQOMDeIi1F-WUEDmwV", name: "F40.1.mp4", type: "video" },
    { id: "1Mq06iGvQs_dSM7RapIRCE_Wa-owVZIZi", name: "F40.2.mp4", type: "video" },
    { id: "1h75F222SNiID7eMV317sdRx1TKKswttH", name: "F40.3.mp4", type: "video" },
  ],
  41: [
    { id: "12zHYC6vOfV14LMKl0z_UvUb3PyXBXi3c", name: "F41.1.mp4", type: "video" },
    { id: "1vua-Jbe4qZG_P3CZyFJiu2s2xOPAjoms", name: "F41.2.mp4", type: "video" },
  ],
  42: [
    { id: "1-6L5XlfEaf7qqmRPxkFEn-mAfpivQFkv", name: "F42.1.mp4", type: "video" },
    { id: "1lYpnslbVSahgFvWssMGy375fTnACG5X2", name: "F42.2.mp4", type: "video" },
  ],
  43: [
    { id: "1mDDFwTv35JWuUolQI-a3NNjIGamVD6He", name: "F43.1.mp4", type: "video" },
    { id: "1SqoV8-X7WakqsZp5oLHsbYMFZJ9jffDp", name: "F43.2.mp4", type: "video" },
  ],
  44: [
    { id: "1o24LdqL41BcMbgvsZBYrxeTvOJ5CE1OP", name: "F44.1.mp4", type: "video" },
    { id: "1CnJOoRYlAvOI62HQ6SWILGnn1eGs_BTw", name: "F44.2.mp4", type: "video" },
  ],
  45: [
    { id: "1NCxXHeZN0sxtzdYskAe6hgvwRfc9-v1S", name: "F45.1.mp4", type: "video" },
    { id: "19QZqbAwnroDzUrrb7wLruKsCMe0Uy2Co", name: "F45.2.mp4", type: "video" },
  ],
  46: [
    { id: "1QXlMKlwicACoO4mNUXr3k6tWwBdHlnRx", name: "F46.1.mp4", type: "video" },
    { id: "1L76xxeF73UQVW7_a5NQbXEp6tgMQDbWR", name: "F46.2.mp4", type: "video" },
  ],
  47: [
    { id: "1HDK39CZ5JuDmNCw6pMgoLfsK6NbJ4ber", name: "F47.1.mp4", type: "video" },
    { id: "1J84uOkcB5PjjjVI6i01TkClEAKrsx49P", name: "F47.2.mp4", type: "video" },
  ],
  48: [
    { id: "1XnC_sYDEPnN6u3NPsfqTusBXeS9x7Mg3", name: "F48.1.mp4", type: "video" },
    { id: "1Ao7WJcv2Ufr48CtgZG1H7O0ZqL7rcVGk", name: "F48.2.mp4", type: "video" },
  ],
  49: [
    { id: "1e_yUPKHZSbdg4ZjbCzu2u3TT0GA7ehOv", name: "F49.1.mp4", type: "video" },
    { id: "11H0l6FSIfb3R-_ZqhZW36W0U1ByqYZg-", name: "F49.2.mp4", type: "video" },
  ],
  50: [
    { id: "1GkEIzroYKI1GDjY0D8Psau8bIr3ByntK", name: "F50.1.mp4", type: "video" },
    { id: "1FZ-DUAoj75e4XLW3aT04yOncNu0msB5b", name: "F50.2.mp4", type: "video" },
  ],
};

const CREATIVES: Creative[] = trelloData.formatos.map((formato) => ({
  id: `creative-${formato.numero}`,
  title: formato.titulo,
  description: formato.descricao,
  category: "Formato de Anúncio",
  tags: [],
  explanation: formato.descricao,
  howToApply: undefined,
  exampleUrl: formato.link_exemplos,
  examples: EXAMPLES_MAP[formato.numero],
}));

const BONUS_LINKS = {
  canva: "https://www.canva.com/design/DAHAk6P1bF0/9avSd90Lh6HXrIBWYqEChQ/edit",
  comunidade: "https://chat.whatsapp.com/LKcvj7nepyhFQVBBI3lC6j",
  swipeFile: "https://drive.google.com/drive/folders/1RhmMHVcjFft9yS-DgZedqzXZE9SXk_Ms?usp=drive_link",
  prompt: "https://drive.google.com/file/d/1kfG7Yi_wtU9d1LUptzSnetR_EYZ7rXX5/view?usp=sharing",
};

const ITEMS_PER_PAGE = 20;

export default function DashboardPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [selectedCreative, setSelectedCreative] = useState<Creative | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [displayedCount, setDisplayedCount] = useState(ITEMS_PER_PAGE);
  const [shouldScrollToBonus, setShouldScrollToBonus] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);
  const bonusRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (shouldScrollToBonus && displayedCount === CREATIVES.length) {
      bonusRef.current?.scrollIntoView({ behavior: "smooth" });
      setShouldScrollToBonus(false);
    }
  }, [displayedCount, shouldScrollToBonus]);

  useEffect(() => {
    const userEmail = sessionStorage.getItem("userEmail");
    if (!userEmail) {
      router.push("/");
      return;
    }
    setEmail(userEmail);
  }, [router]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && displayedCount < CREATIVES.length) {
          setDisplayedCount((prev) => Math.min(prev + ITEMS_PER_PAGE, CREATIVES.length));
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );
    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => {
      if (observerTarget.current) observer.unobserve(observerTarget.current);
    };
  }, [displayedCount]);

  const handleCreativeClick = (creative: Creative) => {
    setSelectedCreative(creative);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedCreative(null), 200);
  };

  const handleBonusClick = () => {
    if (displayedCount < CREATIVES.length) {
      setDisplayedCount(CREATIVES.length);
      setShouldScrollToBonus(true);
    } else {
      bonusRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const displayedCreatives = CREATIVES.slice(0, displayedCount);
  const hasMore = displayedCount < CREATIVES.length;

  return (
    <div className="min-h-screen bg-[#0a0a0a] overflow-x-hidden">
      {/* Background warm glow - corners */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: [
            "radial-gradient(ellipse 60% 50% at 0% 100%, rgba(160,60,0,0.3) 0%, transparent 70%)",
            "radial-gradient(ellipse 60% 50% at 100% 100%, rgba(160,60,0,0.25) 0%, transparent 70%)",
            "radial-gradient(ellipse 40% 30% at 50% 100%, rgba(140,40,0,0.15) 0%, transparent 60%)",
          ].join(", "),
        }}
      />

      <div className="relative z-10 w-full px-4 py-8">
        {/* ── HEADER ── */}
        <header className="border border-white/[0.12] rounded-2xl bg-black/60 mb-4 overflow-hidden">
          <div className="flex items-center justify-between px-3 sm:px-6 py-3 sm:py-5">
            {/* Logo */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex-shrink-0 w-8 h-8 sm:w-12 sm:h-12">
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_2px_8px_rgba(255,77,0,0.4)]">
                  <path
                    d="M50 11 L60.2 5.2 L66.9 14.9 L78.7 14 L80.5 25.6 L91.5 30.1 L88 41.3 L96 50 L88 58.7 L91.5 69.9 L80.5 74.4 L78.7 86 L66.9 85.1 L60.2 94.8 L50 89 L39.8 94.8 L33.1 85.1 L21.3 86 L19.5 74.4 L8.5 69.9 L12 58.7 L4 50 L12 41.3 L8.5 30.1 L19.5 25.6 L21.3 14 L33.1 14.9 L39.8 5.2 Z"
                    fill="#ff4d00"
                  />
                  <text x="50" y="54" textAnchor="middle" dominantBaseline="middle" fill="white" fontFamily="League Spartan, sans-serif" fontWeight="900" fontSize="38">
                    50
                  </text>
                </svg>
              </div>
              <div className="flex flex-col justify-center">
                <div className="font-display font-black text-white text-base sm:text-2xl leading-none uppercase tracking-tight">
                  FORMATOS
                </div>
                <div className="font-sans text-white/50 text-[9px] sm:text-sm font-light leading-tight">
                  que escalam
                </div>
              </div>
            </div>

            {/* Nav links */}
            <nav className="flex items-center gap-2 sm:gap-5">
              <button
                onClick={handleBonusClick}
                className="font-display font-bold text-white/80 text-[9px] sm:text-sm hover:text-[#ff4d00] transition-colors duration-150 uppercase tracking-widest whitespace-nowrap"
              >
                Bônus
              </button>
              <span className="text-white/10 sm:text-white/20">|</span>
              <button
                onClick={() => window.open("https://wa.me/5548996649920", "_blank")}
                className="font-display font-bold text-white/80 text-[9px] sm:text-sm hover:text-[#ff4d00] transition-colors duration-150 uppercase tracking-widest whitespace-nowrap"
              >
                Suporte
              </button>
              <span className="text-white/10 sm:text-white/20">|</span>
              <button
                onClick={() => window.open(BONUS_LINKS.comunidade, "_blank")}
                className="font-display font-bold text-white/80 text-[9px] sm:text-sm hover:text-[#ff4d00] transition-colors duration-150 uppercase tracking-widest whitespace-nowrap"
              >
                Grupo
              </button>
            </nav>
          </div>
        </header>

        {/* ── GRID CONTAINER ── */}
        <div className="border border-white/[0.12] rounded-2xl bg-black/40 p-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {displayedCreatives.map((creative, index) => (
              <CreativeCardV2
                key={creative.id}
                creative={creative}
                onClick={() => handleCreativeClick(creative)}
                index={index}
              />
            ))}
          </div>

          {/* Infinite scroll trigger */}
          {hasMore && (
            <div ref={observerTarget} className="flex justify-center pt-8 pb-2">
              <div className="flex gap-2">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-[#ff4d00] rounded-full animate-pulse"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── BÔNUS ── */}
        <h2 
          ref={bonusRef}
          className="font-display font-black text-[#ff4d00] text-4xl tracking-tight mt-6 mb-3 px-6"
        >
          Bônus
        </h2>
        <div className="border border-white/[0.12] rounded-2xl bg-black/40 p-5">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {[
              { num: "01", title: "Templates no Canva", img: "/bonus/canva.png", link: BONUS_LINKS.canva },
              { num: "02", title: "Prompts de IA", img: "/bonus/prompts.png", link: BONUS_LINKS.prompt },
              { num: "03", title: "Swipe File de Ads", img: "/bonus/swipefile.png", link: BONUS_LINKS.swipeFile },
              { num: "04", title: "Grupo de Alunos", img: "/bonus/grupo.png", link: BONUS_LINKS.comunidade },
            ].map((bonus) => (
              <div
                key={bonus.num}
                onClick={() => window.open(bonus.link, "_blank")}
                className="group cursor-pointer"
              >
                <div className="relative border-2 border-[#ff4d00]/80 rounded-lg overflow-hidden shadow-[0_2px_16px_rgba(255,77,0,0.1)] hover:shadow-[0_4px_24px_rgba(255,77,0,0.25)] hover:border-[#ff4d00] transition-all duration-300">
                  {/* Header with number + title */}
                  <div className="bg-gradient-to-b from-[#1a0a00] to-[#120600] px-3 py-3 flex items-center gap-2.5">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full border-2 border-[#cc3d00] flex items-center justify-center">
                      <span className="font-display font-black text-white text-sm leading-none translate-y-[1px]">{bonus.num}</span>
                    </div>
                    <h3 className="font-sans font-bold text-white text-base leading-snug flex-1">
                      {bonus.title}
                    </h3>
                  </div>

                  {/* Image */}
                  <div className="bg-[#120600] px-4 py-6 flex items-center justify-center min-h-[160px]">
                    <img
                      src={bonus.img}
                      alt={bonus.title}
                      className="max-h-[140px] w-auto object-contain"
                      loading="lazy"
                    />
                  </div>

                  {/* CTA */}
                  <div className="bg-gradient-to-r from-[#fc4900] via-[#ffab8c] to-[#ed3a1d] px-4 py-3 flex items-center justify-center gap-2 group-hover:brightness-110 transition-all duration-200">
                    <span className="font-sans font-black text-black text-xs tracking-[0.15em] uppercase">
                      Clique para acessar
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-black" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-white/20 text-xs font-sans mt-6">
          © 2025 Serraglio — {email}
        </p>
      </div>

      <CreativeModalV2
        creative={selectedCreative}
        open={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
