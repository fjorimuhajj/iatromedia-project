export default {
  async afterCreate(event: { result?: unknown }) {
    const data = event?.result as
      | {
          fullName?: string;
          mobile?: string;
          email?: string;
          message?: string;
        }
      | undefined;

    try {
      const fullName = data?.fullName || '(pa emër)';
      const userEmail = (data?.email || '').trim();
      const mobile = data?.mobile || '';
      const message = data?.message || '';

      if (!userEmail) return;

      await strapi.plugin('email').service('email').send({
        to: userEmail,
        subject: 'Konfirmim: Mesazhi juaj u pranua',
        text: [
          `Përshëndetje ${fullName},`,
          '',
          'Faleminderit! Mesazhi juaj u pranua me sukses.',
          '',
          'Detajet:',
          `- Emri: ${fullName}`,
          `- Celular: ${mobile}`,
          `- Email: ${userEmail}`,
          message ? '' : undefined,
          message ? 'Mesazhi:' : undefined,
          message ? message : undefined,
          '',
          'Iatromedia Group',
        ].join('\n'),
      });
    } catch (err) {
      // Mos e prish krijimin e mesazhit në DB nëse SMTP dështon
      strapi.log.error('Contact-message email send failed', err);
    }
  },
};

