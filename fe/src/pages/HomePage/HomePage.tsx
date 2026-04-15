import {
  ShoppingOutlined,
  ShopOutlined,
  HeartOutlined,
  CoffeeOutlined,
  TeamOutlined,
  RiseOutlined,
  SafetyCertificateOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { Button } from "antd";
import React, { useEffect, useRef, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

// ============================================================
// GLOBAL ANIMATION STYLES
// ============================================================
const GlobalStyles = () => (
  <style>{`
    @keyframes floatY {
      0%, 100% { transform: translateY(0px); }
      50%       { transform: translateY(-22px); }
    }
    @keyframes pulseDim {
      0%, 100% { opacity: 0.12; transform: scale(1); }
      50%       { opacity: 0.30; transform: scale(1.07); }
    }
    @keyframes spinSlow {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }
    @keyframes scrollBounce {
      0%, 100% { transform: translateY(0);   opacity: 1; }
      50%       { transform: translateY(6px); opacity: 0.4; }
    }

    .orb-1 { animation: floatY  7s ease-in-out infinite; }
    .orb-2 { animation: floatY  9s ease-in-out infinite 2.5s; }
    .orb-3 { animation: floatY  5.5s ease-in-out infinite 1s; }
    .orb-pulse { animation: pulseDim 5s ease-in-out infinite; }
    .ring-spin  { animation: spinSlow 22s linear infinite; }
    .ring-spin-r { animation: spinSlow 16s linear infinite reverse; }
    .scroll-dot { animation: scrollBounce 1.6s ease-in-out infinite; }

    /* ---- Business image cross-fade ---- */
    .biz-img {
      position: absolute; inset: 0;
      width: 100%; height: 100%; object-fit: cover;
      transition: opacity 0.65s cubic-bezier(.4,0,.2,1),
                  transform 0.65s cubic-bezier(.4,0,.2,1);
    }
    .biz-img-active   { opacity: 1; transform: scale(1); }
    .biz-img-inactive { opacity: 0; transform: scale(1.04); }

    /* ---- Business card row ---- */
    .biz-row {
      border-left: 3px solid transparent;
      transition: border-color 0.25s, background 0.25s;
    }
    .biz-row:hover,
    .biz-row-active {
      border-left-color: #1B2A4A;
      background: rgba(27,42,74,0.04);
    }
    .biz-row-icon {
      transition: transform 0.3s, background 0.3s, color 0.3s;
    }
    .biz-row:hover .biz-row-icon,
    .biz-row-active .biz-row-icon {
      transform: scale(1.15);
      background: #1B2A4A !important;
      color: white !important;
    }
    .biz-arrow {
      transition: opacity 0.25s, transform 0.25s;
    }
    .biz-row:hover .biz-arrow,
    .biz-row-active .biz-arrow {
      opacity: 1 !important;
      transform: translateX(0) !important;
    }

    /* ---- Hover lift cards ---- */
    .lift-card {
      transition: box-shadow 0.3s, transform 0.3s;
    }
    .lift-card:hover {
      box-shadow: 0 20px 40px rgba(0,0,0,0.10);
      transform: translateY(-4px);
    }
    .icon-box {
      transition: background 0.3s, color 0.3s;
    }
    .lift-card:hover .icon-box {
      background: #1B2A4A !important;
      color: white !important;
    }
  `}</style>
);

// ============================================================
// HOOK — IntersectionObserver reveal
// ============================================================
const useOnScreen = (
  options: IntersectionObserverInit = {},
): [React.RefObject<HTMLDivElement | null>, boolean] => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.unobserve(entry.target);
        }
      },
      { threshold: 0.08, ...options },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return [ref, visible];
};

// ============================================================
// FadeInSection — supports up / left / right
// ============================================================
type Direction = "up" | "left" | "right";

interface FadeInProps {
  children: ReactNode;
  delay?: string;
  direction?: Direction;
  className?: string;
}

const hidden: Record<Direction, string> = {
  up: "opacity-0 translate-y-14",
  left: "opacity-0 -translate-x-14",
  right: "opacity-0 translate-x-14",
};

const FadeIn: React.FC<FadeInProps> = ({
  children,
  delay = "",
  direction = "up",
  className = "",
}) => {
  const [ref, visible] = useOnScreen();
  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${delay} ${
        visible ? "opacity-100 translate-y-0 translate-x-0" : hidden[direction]
      } ${className}`}
    >
      {children}
    </div>
  );
};

const BUSINESSES = [
  {
    title: "Masan Consumer",
    desc: "Sản phẩm tiêu dùng nhanh (FMCG) hàng đầu Việt Nam — từ nước mắm, tương ớt đến mì ăn liền.",
    icon: <ShoppingOutlined />,
    tag: "FMCG",
    image: "/bg_homepage/bg_masan_consume.jpg", // ← tự map lại
    website: "https://masanconsumer.com/en/",
  },
  {
    title: "WinCommerce",
    desc: "Chuỗi bán lẻ hiện đại lớn nhất Việt Nam với hàng nghìn điểm WinMart & WinMart+.",
    icon: <ShopOutlined />,
    tag: "Bán lẻ",
    image: "/bg_homepage/bg_wm1.jpg", // ← tự map lại
    website: "https://winmart.vn/",
  },
  {
    title: "Masan MEATLife",
    desc: "Tiên phong xây dựng chuỗi giá trị thịt sạch có thương hiệu từ farm đến bàn ăn.",
    icon: <HeartOutlined />,
    tag: "Thực phẩm",
    image: "/bg_homepage/MS_Meat.jpg", // ← tự map lại
    website: "https://masanmeatlife.com.vn/",
  },
  {
    title: "Phúc Long",
    desc: "Chuỗi cửa hàng trà & cà phê cao cấp với di sản trên 55 năm.",
    icon: <CoffeeOutlined />,
    tag: "F&B",
    image: "/bg_homepage/bg_pl1.webp", // ← tự map lại
    website: "https://phuclong.com.vn/",
  },
];

// ============================================================
// MAIN COMPONENT
// ============================================================
const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeBiz, setActiveBiz] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 overflow-x-hidden">
      <GlobalStyles />

      {/* ====================================================
          HERO
      ==================================================== */}
      <section className="relative flex items-center justify-center h-screen bg-linear-to-br from-[#1B2A4A] via-[#243B5E] to-[#0D1F35] text-white overflow-hidden">
        {/* Animated background layer */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Floating blobs */}
          <div className="orb-1 orb-pulse absolute top-[12%] left-[8%]  w-72 h-72 rounded-full bg-white/10 blur-3xl" />
          <div className="orb-2 orb-pulse absolute bottom-[16%] right-[6%] w-96 h-96 rounded-full bg-[#0A1628]/50 blur-3xl" />
          <div className="orb-3 orb-pulse absolute top-[55%] left-[50%]  w-52 h-52 rounded-full bg-white/5  blur-2xl" />
          {/* Dot grid */}
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "radial-gradient(circle, white 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />
          {/* Spinning rings */}
          <div className="ring-spin  absolute -bottom-40 -right-40 w-md h-112 rounded-full border border-white/10" />
          <div className="ring-spin-r absolute -top-28   -left-28  w-80   h-80   rounded-full border border-white/10" />
        </div>

        {/* Hero content */}
        <div className="relative z-10 max-w-5xl px-6 text-center">
          <FadeIn>
            <span className="inline-block px-4 py-1.5 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm text-sm font-medium mb-7 tracking-wider">
              ✦ Hệ thống Quản trị Rủi ro Nhân sự
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-5 leading-none">
              Masan Group
            </h1>
          </FadeIn>

          <FadeIn delay="delay-150">
            <p className="text-xl md:text-2xl font-light mb-10 opacity-80 max-w-2xl mx-auto leading-relaxed">
              Nâng cao đời sống vật chất và tinh thần của người tiêu dùng Việt
              Nam.
            </p>
          </FadeIn>

          <FadeIn delay="delay-300">
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                type="primary"
                size="large"
                className="bg-white! text-[#1B2A4A]! hover:bg-gray-100! border-none! font-semibold! px-10! h-12! rounded-full! text-base! shadow-xl!"
                onClick={() => navigate("/loginwithlove")}
              >
                Hệ Thống Nhân Sự
              </Button>
              <Button
                ghost
                size="large"
                className="border-white/60! text-white! hover:border-white! font-semibold! px-10! h-12! rounded-full! text-base!"
                onClick={() =>
                  document
                    .getElementById("about")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Khám Phá ↓
              </Button>
            </div>
          </FadeIn>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-9 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-50">
          <div className="w-5 h-8 rounded-full border-2 border-white flex items-start justify-center pt-1.5">
            <div className="scroll-dot w-1 h-1.5 bg-white rounded-full" />
          </div>
        </div>
      </section>

      {/* ====================================================
          ABOUT
      ==================================================== */}
      <section id="about" className="py-28 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <FadeIn direction="left">
            <div className="relative rounded-3xl overflow-hidden h-104 shadow-2xl group">
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-linear-to-br from-[#1B2A4A]/20 to-[#0D1F35]/40 z-10 group-hover:opacity-70 transition-opacity duration-500" />
              <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-400 font-medium">
                <img src="/bg_homepage/cover-masan-1-1-2.jpg" />
              </div>
              {/* Floating badges */}
              <div className="absolute bottom-6 left-6 z-20 bg-white/90 backdrop-blur-sm rounded-2xl px-5 py-3 shadow-lg">
                <p className="text-xs text-gray-500 font-medium">Thành lập</p>
                <p className="text-2xl font-bold text-gray-900">1996</p>
              </div>
              <div className="absolute top-6 right-6 z-20 bg-[#1B2A4A] rounded-2xl px-5 py-3 shadow-lg text-white text-center">
                <p className="text-xs font-medium opacity-80">Nhân sự</p>
                <p className="text-2xl font-bold">40,000+</p>
              </div>
            </div>
          </FadeIn>

          <FadeIn direction="right" delay="delay-150">
            <p className="text-sm font-bold text-[#1B2A4A] uppercase tracking-widest mb-3">
              Về Chúng Tôi
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              Hệ Sinh Thái{" "}
              <span className="text-[#1B2A4A]">Tiêu Dùng — Công Nghệ</span>
            </h2>
            <p className="text-gray-600 leading-relaxed mb-5">
              Masan Group là một trong những tập đoàn kinh tế tư nhân lớn nhất
              Việt Nam. Với chiến lược <strong>"Point of Life"</strong>, chúng
              tôi không ngừng mở rộng hệ sinh thái tiêu dùng — bán lẻ — công
              nghệ, nhằm đáp ứng trọn vẹn các nhu cầu thiết yếu hàng ngày của
              hàng chục triệu người dân.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Chúng tôi tin rằng, nền tảng của sự phát triển bền vững không chỉ
              nằm ở sản phẩm xuất sắc, mà còn ở việc kiến tạo một môi trường làm
              việc thúc đẩy sự sáng tạo và phát triển của từng cá nhân.
            </p>

            <div className="flex gap-10 mt-8 pt-8 border-t border-gray-100">
              {[
                { val: "28+", label: "Năm kinh nghiệm" },
                { val: "4", label: "Mảng kinh doanh" },
                { val: "63", label: "Tỉnh thành" },
              ].map((s, i) => (
                <div key={i}>
                  <p className="text-2xl font-bold text-[#1B2A4A]">{s.val}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ====================================================
          BUSINESS — image panel + hover cards
      ==================================================== */}
      <section id="business" className="py-28 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <FadeIn>
            <div className="text-center mb-14">
              <p className="text-sm font-bold text-[#1B2A4A] uppercase tracking-widest mb-2">
                Lĩnh Vực Hoạt Động
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Core Business Của Chúng Tôi
              </h2>
            </div>
          </FadeIn>

          <FadeIn delay="delay-150">
            <div className="flex flex-col lg:flex-row rounded-3xl overflow-hidden shadow-2xl border border-gray-100">
              {/* ── Left: image panel ── */}
              <div className="relative w-full lg:w-1/2 h-72 lg:h-auto lg:min-h-130 shrink-0 bg-gray-900 overflow-hidden">
                {BUSINESSES.map((biz, i) => (
                  <img
                    key={i}
                    src={biz.image}
                    alt={biz.title}
                    className={`biz-img ${activeBiz === i ? "biz-img-active" : "biz-img-inactive"}`}
                  />
                ))}
                {/* Bottom gradient */}
                <div className="absolute inset-0 bg-linear-to-t from-black/65 via-transparent to-transparent z-10" />
                {/* Active label */}
                <div className="absolute bottom-7 left-7 z-20">
                  <span
                    key={`tag-${activeBiz}`}
                    className="inline-block bg-[#1B2A4A] text-white text-xs font-bold px-3 py-1 rounded-full mb-2 uppercase tracking-widest"
                  >
                    {BUSINESSES[activeBiz].tag}
                  </span>
                  <h3
                    key={`title-${activeBiz}`}
                    className="text-2xl font-bold text-white drop-shadow-lg"
                  >
                    {BUSINESSES[activeBiz].title}
                  </h3>
                </div>
              </div>

              {/* ── Right: card list ── */}
              <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center divide-y divide-gray-100">
                {BUSINESSES.map((biz, i) => (
                  <div
                    key={i}
                    className={`biz-row flex items-start gap-5 px-8 py-7 cursor-pointer ${activeBiz === i ? "biz-row-active" : ""}`}
                    onMouseEnter={() => setActiveBiz(i)}
                  >
                    <div
                      className={`biz-row-icon w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 ${
                        activeBiz === i
                          ? "bg-[#1B2A4A] text-white"
                          : "bg-[#EBF0F8] text-[#1B2A4A]"
                      }`}
                    >
                      {biz.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <h4 className="font-bold text-gray-900 text-lg leading-tight">
                          {biz.title}
                        </h4>
                        <ArrowRightOutlined
                          className={`biz-arrow text-[#1B2A4A] text-sm shrink-0 ${
                            activeBiz === i
                              ? "opacity-100 translate-x-0"
                              : "opacity-0 -translate-x-2"
                          }`}
                          onClick={() =>
                            window.open(
                              biz.website,
                              "_blank",
                              "noopener,noreferrer",
                            )
                          }
                        />
                      </div>
                      <p className="text-gray-500 text-sm leading-relaxed">
                        {biz.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ====================================================
          OUR PEOPLE
      ==================================================== */}
      <section id="people" className="py-28 px-6 md:px-12 max-w-7xl mx-auto">
        <FadeIn>
          <div className="text-center mb-14">
            <p className="text-sm font-bold text-[#1B2A4A] uppercase tracking-widest mb-2">
              Our People
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Nhân Tài Là Tài Sản Cốt Lõi
            </h2>
          </div>
        </FadeIn>

        {/* Stat bar */}
        <FadeIn delay="delay-100">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { val: "40,000+", label: "Nhân sự toàn quốc" },
              { val: "63", label: "Tỉnh thành phủ sóng" },
              { val: "4", label: "Mảng kinh doanh lớn" },
              { val: "28+", label: "Năm phát triển" },
            ].map((s, i) => (
              <div
                key={i}
                className="lift-card bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100"
              >
                <p className="text-2xl font-bold text-[#1B2A4A] mb-1">
                  {s.val}
                </p>
                <p className="text-sm text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Big red card */}
          <FadeIn direction="left" delay="delay-100">
            <div className="relative bg-linear-to-br from-[#1B2A4A] to-[#0D1F35] text-white p-10 rounded-3xl h-full flex flex-col justify-between overflow-hidden">
              <div
                className="absolute inset-0 opacity-[0.08]"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                  backgroundSize: "24px 24px",
                }}
              />
              <div className="orb-pulse absolute -bottom-12 -right-12 w-40 h-40 rounded-full bg-white/10" />
              <div className="relative z-10">
                <TeamOutlined className="text-5xl mb-6 opacity-75" />
                <h4 className="text-2xl font-bold mb-4">40,000+ Nhân Sự</h4>
                <p className="opacity-80 leading-relaxed text-sm">
                  Đội ngũ nhân sự khổng lồ trải dài khắp cả nước là động lực
                  mạnh mẽ nhất thúc đẩy sự phát triển của hệ sinh thái Masan.
                </p>
              </div>
              <div className="relative z-10 mt-8">
                <div className="w-full bg-white/20 rounded-full h-1.5">
                  <div className="bg-white rounded-full h-1.5 w-4/5" />
                </div>
                <p className="text-xs opacity-50 mt-1.5">
                  Employee Satisfaction 80%
                </p>
              </div>
            </div>
          </FadeIn>

          {/* 2-col sub-grid */}
          <div className="md:col-span-2 grid sm:grid-cols-2 gap-6">
            <FadeIn delay="delay-200">
              <div className="lift-card bg-white p-8 rounded-3xl shadow-sm border border-gray-100 h-full group">
                <div className="icon-box w-12 h-12 bg-[#EBF0F8] text-[#1B2A4A] rounded-xl flex items-center justify-center text-2xl mb-5">
                  <SafetyCertificateOutlined />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">
                  Phát Triển Bền Vững
                </h4>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Xây dựng môi trường làm việc hạnh phúc, minh bạch và trao
                  quyền. Đảm bảo lộ trình thăng tiến rõ ràng cho từng cá nhân.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay="delay-300">
              <div className="lift-card bg-white p-8 rounded-3xl shadow-sm border border-gray-100 h-full relative overflow-hidden group">
                <div className="icon-box w-12 h-12 bg-[#EBF0F8] text-[#1B2A4A] rounded-xl flex items-center justify-center text-2xl mb-5 relative z-10">
                  <RiseOutlined />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3 relative z-10">
                  AI & Quản Trị Nhân Sự
                </h4>
                <p className="text-gray-500 text-sm leading-relaxed relative z-10">
                  Ứng dụng Data Mining để dự báo sớm rủi ro nghỉ việc và chủ
                  động giữ chân nhân tài xuất sắc.
                </p>
                <div className="absolute -bottom-6 -right-6 text-[7rem] text-gray-50 z-0 pointer-events-none">
                  <RiseOutlined />
                </div>
              </div>
            </FadeIn>

            {/* CTA banner */}
            <div className="sm:col-span-2">
              <FadeIn delay="delay-[400ms]">
                <div className="bg-linear-to-r from-gray-900 to-gray-800 p-8 rounded-3xl text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg hover:shadow-2xl transition-shadow duration-300">
                  <div>
                    <h4 className="text-lg font-bold mb-1">
                      Khám Phá Hệ Thống MasanHR
                    </h4>
                    <p className="text-gray-400 text-sm">
                      Phân tích dữ liệu nhân sự theo thời gian thực.
                    </p>
                  </div>
                  <Button
                    type="primary"
                    className="bg-[#1B2A4A]! hover:bg-[#243B5E]! border-none! rounded-full! px-7! h-11! font-semibold! shrink-0"
                    onClick={() => navigate("/loginwithlove")}
                    icon={<ArrowRightOutlined />}
                  >
                    Truy cập
                  </Button>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================
          FOOTER
      ==================================================== */}
      <footer className="bg-gray-900 text-gray-400 py-10 text-center text-sm">
        <p className="font-bold text-gray-300 text-base mb-2">
          MASAN<span className="text-[#1B2A4A]">HR</span>
        </p>
        <p>© 2026 Masan Group. Employee Churn Prediction Project.</p>
      </footer>
    </div>
  );
};

export default HomePage;
