import { Link } from "react-router-dom";

const ContactCTA = () => (
  <section className="px-6 md:px-16 py-24">
    <div
      className="reveal rounded-2xl p-12 md:p-20 text-center relative overflow-hidden"
      style={{
        border: "1px solid rgba(74,222,128,0.15)",
        background: "linear-gradient(135deg, rgba(74,222,128,0.04), transparent 60%)",
      }}
    >
      <div
        data-parallax="0.08"
        className="absolute top-[-50%] left-[20%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(74,222,128,0.06) 0%, transparent 70%)",
        }}
      />
      <div className="relative z-10">
        <span className="section-tag">[ GET IN TOUCH ]</span>
        <h2 className="font-display text-[clamp(36px,4.5vw,64px)] mt-4 mb-6">
          Ready to secure
          <br />
          <span className="text-ghost font-display italic">your channels?</span>
        </h2>
        <p className="font-body text-dg-text-dim max-w-md mx-auto mb-10">
          Deploy Digital Guardian across your organization. Three AI channels. One unified threat response.
        </p>
        <Link
          to="/email"
          className="inline-flex items-center font-body text-[13px] font-semibold px-10 py-4 rounded-full transition-all hover:-translate-y-0.5"
          style={{
            background: "#4ade80",
            color: "#020c02",
            boxShadow: "0 4px 20px rgba(74,222,128,0.2)",
          }}
        >
          Try a Scanner →
        </Link>
      </div>
    </div>
  </section>
);

export default ContactCTA;
