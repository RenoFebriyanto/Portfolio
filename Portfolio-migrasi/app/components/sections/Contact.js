import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { sendContactEmail } from '~/utils/emailjs';
export function Contact() {
    const [status, setStatus] = useState('idle');
    const [form, setForm] = useState({
        from_name: '', from_email: '', subject: '', message: '',
    });
    const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));
    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');
        try {
            await sendContactEmail(form);
            setStatus('success');
            setForm({ from_name: '', from_email: '', subject: '', message: '' });
        }
        catch {
            setStatus('error');
        }
    };
    return (_jsx("section", { className: "section scrollable contact", id: "contact", children: _jsx("div", { className: "container", children: _jsxs("div", { className: "contact__inner", children: [_jsxs("div", { className: "contact__info reveal", children: [_jsx("p", { className: "section-label", children: "04 \u2014 Contact" }), _jsx("h2", { className: "section-heading", children: "Let's Work Together" }), _jsx("p", { className: "contact__body", children: "Have a project in mind? Looking for a collaborator in game dev, 3D, or interactive web? I'd love to hear from you." }), _jsxs("div", { className: "contact__details", children: [_jsxs("div", { className: "contact__detail", children: [_jsx("span", { className: "contact__detail-icon", children: "\u2709" }), _jsxs("div", { children: [_jsx("span", { className: "contact__detail-label", children: "Email" }), _jsx("span", { className: "contact__detail-value", children: _jsx("a", { href: "mailto:renofebriyanto94@gmail.com", children: "renofebriyanto94@gmail.com" }) })] })] }), _jsxs("div", { className: "contact__detail", children: [_jsx("span", { className: "contact__detail-icon", children: "\uD83D\uDCCD" }), _jsxs("div", { children: [_jsx("span", { className: "contact__detail-label", children: "Location" }), _jsx("span", { className: "contact__detail-value", children: "Indonesia" })] })] }), _jsxs("div", { className: "contact__detail", children: [_jsx("span", { className: "contact__detail-icon", children: "\uD83C\uDFAE" }), _jsxs("div", { children: [_jsx("span", { className: "contact__detail-label", children: "itch.io" }), _jsx("span", { className: "contact__detail-value", children: _jsx("a", { href: "https://catmounth.itch.io", target: "_blank", rel: "noreferrer", children: "catmounth.itch.io" }) })] })] })] })] }), _jsx("div", { className: "contact__form-wrapper reveal", children: _jsxs("form", { className: "contact__form", onSubmit: handleSubmit, noValidate: true, children: [_jsxs("div", { className: "form-row", children: [_jsxs("div", { className: "form-field", children: [_jsx("label", { htmlFor: "contact-name", children: "Name" }), _jsx("input", { id: "contact-name", type: "text", placeholder: "Your name", required: true, value: form.from_name, onChange: set('from_name') })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { htmlFor: "contact-email", children: "Email" }), _jsx("input", { id: "contact-email", type: "email", placeholder: "your@email.com", required: true, value: form.from_email, onChange: set('from_email') })] })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { htmlFor: "contact-subject", children: "Subject" }), _jsx("input", { id: "contact-subject", type: "text", placeholder: "Project inquiry / Collaboration / ...", required: true, value: form.subject, onChange: set('subject') })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { htmlFor: "contact-message", children: "Message" }), _jsx("textarea", { id: "contact-message", placeholder: "Tell me about your project...", required: true, value: form.message, onChange: set('message') })] }), status === 'success' && (_jsx("p", { className: "form-status success", children: "Message sent! I'll get back to you soon." })), status === 'error' && (_jsx("p", { className: "form-status error", children: "Something went wrong. Please try again." })), _jsx("button", { type: "submit", className: "form-submit", disabled: status === 'sending', children: status === 'sending' ? 'Sending...' : 'Send Message →' })] }) })] }) }) }));
}
