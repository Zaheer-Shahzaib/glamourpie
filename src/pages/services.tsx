import React from 'react';
import { Link } from 'react-router-dom';
import { PATH_AUTH } from '../routes';
import GuestLayout from '../layout/Guest';

const Sitemap: React.FC = () => {
  return (
    <GuestLayout>
      <div style={{
        '--bg': '#f7f7f9',
        '--ink': '#222',
        '--muted': '#6a6f7a',
        '--brand': '#0b5fff',
        '--card': '#ffffff',
        '--line': '#dfe3ea'
      } as React.CSSProperties}>
        <style>{`
        .services-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 24px;
          // background: var(--bg);
          color: var(--ink);
          font-family: Arial, Helvetica, sans-serif;
        }
        .wire {
          outline: 2px dashed var(--line);
          background: #fff;
          border-radius: 14px;
          box-shadow: 0 1px 6px rgba(0,0,0,.06);
        }
        .section {
          padding: 36px;
        }
        .h1 {
          font-size: 34px;
          margin: 0 0 12px;
        }
        .p {
          color: var(--muted);
          margin: 0 0 20px;
        }
        .row {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 24px;
        }
        .cta {
          display: inline-block;
          background: var(--brand);
          color: #fff;
          padding: 12px 18px;
          border-radius: 10px;
          text-decoration: none;
          font-weight: 700;
        }
        .ph {
          display: flex;
          align-items: center;
          justify-content: center;
          background: #eef1f6;
          border: 2px solid var(--line);
          border-radius: 12px;
          color: #8a909a;
          min-height: 260px;
          position: relative;
        }
        .ph:before {
          content: "IMAGE";
          font-weight: 700;
          letter-spacing: 3px;
        }
        .caption {
          font-size: 12px;
          color: #8a909a;
          text-align: center;
          margin-top: 6px;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }
        .card {
          background: var(--card);
          border: 2px dashed var(--line);
          border-radius: 12px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          min-height: 220px;
        }
        .card .ph {
          min-height: 120px;
        }
        .card h3 {
          margin: 0;
          font-size: 16px;
        }
        .bullet {
          height: 8px;
          background: #e9edf3;
          border-radius: 6px;
          margin: 6px 0;
        }
        .two {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-top: 24px;
        }
        .strip {
          background: #eef4ff;
          border-top: 2px dashed var(--line);
          border-bottom: 2px dashed var(--line);
        }
        .full {
          min-height: 320px;
        }
        .cta-wrap {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }
        .ghost {
          display: inline-block;
          padding: 12px 16px;
          border-radius: 10px;
          border: 2px solid #fff;
          color: #fff;
          text-decoration: none;
        }
        @media (max-width: 980px) {
          .row, .two {
            grid-template-columns: 1fr;
          }
          .grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (max-width: 640px) {
          .grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

        <div className="services-container">
          {/* HERO */}
          <section className="wire section">
            <div className="row">
              <div>
                <div className="h1">Automated, Compliant Invoicing for Amazon Sellers</div>
                <div className="p">Save time, stay VAT‑compliant, and grow your business with our secure SP‑API powered invoicing solution.</div>
                <Link className="cta" to={PATH_AUTH.signup}>Start Free Trial</Link>
                <div className="caption" style={{ marginTop: '10px' }}>Primary CTA</div>
              </div>
              <div>
                <div className="ph full"></div>
                <div className="caption">Dashboard Screenshot – demo data only</div>
              </div>
            </div>
          </section>

          {/* FEATURES GRID 3x2 */}
          <section className="section">
            <h2 style={{ margin: '0 0 14px' }}>Why Choose RunAnalytic</h2>
            <div className="grid">
              <div className="card">
                <h3>Automatic Invoice Uploading</h3>
                <div className="bullet"></div>
                <div className="bullet" style={{ width: '85%' }}></div>
                <div className="ph"></div>
                <div className="caption">Invoice upload confirmation (demo)</div>
              </div>
              <div className="card">
                <h3>Smart Invoice Templates</h3>
                <div className="bullet"></div>
                <div className="bullet" style={{ width: '75%' }}></div>
                <div className="ph"></div>
                <div className="caption">Simple vs Premium templates</div>
              </div>
              <div className="card">
                <h3>Track Everything</h3>
                <div className="bullet"></div>
                <div className="bullet" style={{ width: '65%' }}></div>
                <div className="ph"></div>
                <div className="caption">Analytics / status dashboard</div>
              </div>
              <div className="card">
                <h3>Transparent Pricing</h3>
                <div className="bullet"></div>
                <div className="bullet" style={{ width: '55%' }}></div>
                <div className="ph"></div>
                <div className="caption">Pricing cards (no PII)</div>
              </div>
              <div className="card">
                <h3>Mobile App Coming Soon</h3>
                <div className="bullet"></div>
                <div className="bullet" style={{ width: '70%' }}></div>
                <div className="ph"></div>
                <div className="caption">iOS / Android mockups</div>
              </div>
              <div className="card">
                <h3>Security & Compliance</h3>
                <div className="bullet"></div>
                <div className="bullet" style={{ width: '60%' }}></div>
                <div className="ph"></div>
                <div className="caption">Icons: TLS, AES‑256, MFA, 30/90</div>
              </div>
            </div>
          </section>

          {/* DETAILED BLOCKS (ALT L/R) */}
          <section className="wire section">
            <h2 style={{ marginTop: '0' }}>Deep‑Dive Sections</h2>
            <div className="two">
              <div className="ph"></div>
              <div>
                <h3>Automatic Invoice Uploading</h3>
                <div className="p">Explain SP‑API flow: Order → Invoice → Upload → Confirmation. Benefits: speed, accuracy, compliance.</div>
              </div>
            </div>
            <div className="two">
              <div>
                <h3>Smart Invoice Templates</h3>
                <div className="p">Show template variants (VAT / non‑VAT). Mention FTA alignment and Amazon Invoice Upload Policy.</div>
              </div>
              <div className="ph"></div>
            </div>
          </section>

          {/* COMPLIANCE STRIP */}
          <section className="wire section strip">
            <h2 style={{ margin: '0 0 8px' }}>Security & Compliance You Can Trust</h2>
            <div className="p">Aligned with Amazon's SP‑API Data Protection Policy (DPP), Acceptable Use Policy (AUP), and Developer Agreement. All screenshots use fictional demo data only.</div>
          </section>

          {/* CTA FOOTER */}
          <section className="section" style={{ paddingBottom: '80px' }}>
            <div className="wire section cta-wrap" style={{ background: '#0b5fff', color: '#fff' }}>
              <div>
                <div className="h1" style={{ color: '#fff', fontSize: '26px' }}>Get Started Today</div>
                <div className="p" style={{ color: '#e9f0ff' }}>Automate VAT‑compliant invoicing for Amazon sellers. Try it free — no credit card required.</div>
              </div>
              <div>
                <Link className="ghost" to={PATH_AUTH.signup}>Start Free Trial</Link>
              </div>
            </div>
            <div className="caption" style={{
              marginTop: '8px'
            }}>Screenshots are for demonstration purposes only. All data shown is fictional.</div>
          </section>
        </div>
      </div>

    </GuestLayout>
  );
};

export default Sitemap;
