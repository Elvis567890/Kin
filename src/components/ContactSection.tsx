import { FormEvent, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { FadeIn } from './FadeIn';

interface ContactSectionProps {
  contactEmail: string;
  regionalHubs: string;
}

export function ContactSection({
  contactEmail,
  regionalHubs,
}: ContactSectionProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [topic, setTopic] = useState('Abrimax Studio Enterprise Licensing');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!emailValid) {
      setError('Please enter a valid work or personal email address.');
      return;
    }

    setError('');
    setSubmitted(true);
  };

  return (
    <section id="contact" className="border-b border-white/10 bg-[#050507] py-20 lg:py-28">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <FadeIn className="lg:col-span-5">
            <p className="text-sm font-medium text-[#D4AF37]">
              Enterprise &amp; Partnerships
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-[#F5F5F7] sm:text-4xl [text-wrap:balance]">
              Deploy AFRINODE across your broadcast or enterprise network.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-zinc-300">
              Speak directly with our solutions engineering team for Abrimax Studio
              newsroom licensing, custom MDM deployments, or early access to our 2027
              product suite.
            </p>

            <dl className="mt-10 space-y-5 border-t border-white/10 pt-8 text-sm">
              <div>
                <dt className="text-xs font-medium text-zinc-400">
                  Enterprise Desk
                </dt>
                <dd className="mt-1 font-medium text-[#F5F5F7]">
                  {contactEmail}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-zinc-400">
                  Regional Headquarters
                </dt>
                <dd className="mt-1 text-zinc-300">
                  {regionalHubs}
                </dd>
              </div>
            </dl>
          </FadeIn>

          <FadeIn delay={0.1} className="lg:col-span-7">
            <div className="border border-white/12 bg-[#0D0D11] p-7 sm:p-10">
              {submitted ? (
                <div className="py-8">
                  <CheckCircle2 className="h-9 w-9 text-[#D4AF37]" strokeWidth={1.75} />
                  <h3 className="mt-4 font-display text-2xl font-semibold text-[#F5F5F7]">
                    Inquiry received
                  </h3>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-zinc-300">
                    Thank you, {name}. Our engineering team has logged your request
                    regarding <span className="text-[#F5F5F7]">{topic}</span> and will
                    respond to <span className="text-[#D4AF37]">{email}</span> within one
                    business day.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setName('');
                      setEmail('');
                      setOrganization('');
                      setMessage('');
                    }}
                    className="mt-6 inline-flex min-h-[42px] items-center border border-white/20 px-5 py-2 text-xs font-semibold text-[#F5F5F7] transition-colors hover:border-[#D4AF37] hover:text-[#D4AF37] cursor-pointer"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="block text-xs font-medium text-zinc-300"
                      >
                        Full Name
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Amara Okafor"
                        required
                        className="mt-2 block w-full border border-white/15 bg-[#050507] px-4 py-3 text-sm text-[#F5F5F7] placeholder:text-zinc-500 focus:border-[#D4AF37] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="contact-email"
                        className="block text-xs font-medium text-zinc-300"
                      >
                        Work Email
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="amara@network.africa"
                        required
                        className="mt-2 block w-full border border-white/15 bg-[#050507] px-4 py-3 text-sm text-[#F5F5F7] placeholder:text-zinc-500 focus:border-[#D4AF37] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="contact-org"
                        className="block text-xs font-medium text-zinc-300"
                      >
                        Organization
                      </label>
                      <input
                        id="contact-org"
                        type="text"
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                        placeholder="Pan-African Media Group"
                        className="mt-2 block w-full border border-white/15 bg-[#050507] px-4 py-3 text-sm text-[#F5F5F7] placeholder:text-zinc-500 focus:border-[#D4AF37] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="contact-topic"
                        className="block text-xs font-medium text-zinc-300"
                      >
                        Area of Interest
                      </label>
                      <select
                        id="contact-topic"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="mt-2 block w-full border border-white/15 bg-[#050507] px-4 py-3 text-sm text-[#F5F5F7] focus:border-[#D4AF37] focus:outline-none"
                      >
                        <option value="Abrimax Studio Enterprise Licensing">
                          Abrimax Studio Enterprise Licensing
                        </option>
                        <option value="Afrinode Pulse Early Access">
                          Afrinode Pulse Early Access
                        </option>
                        <option value="Afrinode Core AI Early Access">
                          Afrinode Core AI Early Access
                        </option>
                        <option value="Regional Infrastructure Partnership">
                          Regional Infrastructure Partnership
                        </option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="contact-message"
                      className="block text-xs font-medium text-zinc-300"
                    >
                      Project Scope
                    </label>
                    <textarea
                      id="contact-message"
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Share details on your broadcast team size, deployment region, or technical requirements."
                      className="mt-2 block w-full border border-white/15 bg-[#050507] px-4 py-3 text-sm text-[#F5F5F7] placeholder:text-zinc-500 focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>

                  {error && (
                    <p role="alert" className="text-xs font-medium text-[#E5C558]">
                      {error}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                    <p className="text-xs text-zinc-400">
                      Protected under AFRINODE Enterprise Privacy Governance.
                    </p>
                    <button
                      type="submit"
                      className="inline-flex min-h-[46px] items-center justify-center bg-[#D4AF37] px-7 py-3 text-sm font-semibold text-[#050507] whitespace-nowrap shrink-0 transition-colors hover:bg-[#E5C558] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37] cursor-pointer"
                    >
                      Request Consultation
                    </button>
                  </div>
                </form>
              )}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
