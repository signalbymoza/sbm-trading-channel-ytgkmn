import nodemailer from 'nodemailer';

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'localhost',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: process.env.SMTP_USER && process.env.SMTP_PASSWORD ? {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  } : undefined,
});

export interface ConfirmationEmailData {
  email: string;
  name: string;
  channelType?: string;
  subscriptionDuration?: string;
  program: string;
  planAmount?: string;
  telegramInviteLink?: string;
}

// Generate bilingual HTML email content
function generateEmailHTML(data: ConfirmationEmailData): string {
  const isProfitPlan = data.program === 'profit_plan';
  const isGoldChannel = !isProfitPlan && data.channelType?.toLowerCase() === 'gold';
  const programLabel = isProfitPlan ? 'Profit Plan' : 'Channel Subscription';
  const planLabel = data.planAmount ? `$${data.planAmount}` : 'N/A';
  const telegramLink = data.telegramInviteLink || process.env.TELEGRAM_GOLD_CHANNEL_INVITE || 'https://t.me/+9ckhkN9-kfJjZDk8';

  return `
    <!DOCTYPE html>
    <html lang="en" dir="ltr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; }
        .header { background-color: #1a73e8; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
        .content { background-color: white; padding: 30px; border: 1px solid #ddd; border-radius: 0 0 5px 5px; }
        .section { margin: 20px 0; }
        .section-title { font-size: 16px; font-weight: bold; color: #1a73e8; margin-bottom: 10px; border-bottom: 2px solid #1a73e8; padding-bottom: 5px; }
        .details-table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        .details-table td { padding: 8px; border-bottom: 1px solid #eee; }
        .details-table td:first-child { font-weight: bold; width: 40%; color: #555; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; }
        .ar-text { direction: rtl; text-align: right; margin-top: 40px; padding-top: 20px; border-top: 2px solid #ddd; }
        .divider { height: 2px; background-color: #eee; margin: 30px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- English Section -->
        <div class="header">
          <h1>Welcome to SBM Trading Channel</h1>
          <p>Registration Confirmation</p>
        </div>

        <div class="content">
          <div class="section">
            <p>Dear <strong>${data.name}</strong>,</p>
            <p>Thank you for registering with SBM Trading Channel. We are excited to have you on board!</p>
          </div>

          <div class="section">
            <div class="section-title">Registration Details</div>
            <table class="details-table">
              <tr>
                <td>Name:</td>
                <td>${data.name}</td>
              </tr>
              <tr>
                <td>Email:</td>
                <td>${data.email}</td>
              </tr>
              <tr>
                <td>Program:</td>
                <td>${programLabel}</td>
              </tr>
              ${!isProfitPlan ? `
              <tr>
                <td>Channel Type:</td>
                <td>${data.channelType || 'N/A'}</td>
              </tr>
              <tr>
                <td>Duration:</td>
                <td>${data.subscriptionDuration || 'N/A'}</td>
              </tr>
              ` : `
              <tr>
                <td>Plan Amount:</td>
                <td>${planLabel}</td>
              </tr>
              `}
            </table>
          </div>

          ${isGoldChannel ? `
          <div class="section" style="background-color: #fff3cd; border: 2px solid #ffc107; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <div class="section-title" style="color: #856404; border-color: #856404;">🔑 Your Gold Channel Access Link</div>
            <p style="font-size: 14px; margin: 15px 0;">
              Your exclusive Gold channel is now ready! Click the link below to join our private Telegram channel and start receiving premium trading signals:
            </p>
            <div style="text-align: center; margin: 20px 0;">
              <a href="${telegramLink}" style="display: inline-block; background-color: #0088cc; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">
                🔗 Join Gold Channel on Telegram
              </a>
            </div>
            <p style="font-size: 12px; color: #666; margin: 15px 0;">
              <strong>Direct Link:</strong> <a href="${telegramLink}" style="color: #0088cc; text-decoration: underline;">${telegramLink}</a>
            </p>
          </div>
          ` : ''}

          <div class="section">
            <div class="section-title">Next Steps</div>
            ${isGoldChannel ? `
            <p><strong>Your Gold Channel is Ready!</strong></p>
            <p>You can now join our exclusive Telegram channel to access premium trading signals and analysis.</p>
            <p style="margin: 15px 0;">
              <a href="${telegramLink}" style="display: inline-block; background-color: #0088cc; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Join Gold Channel on Telegram</a>
            </p>
            <p>If you encounter any issues joining the channel, please contact our support team.</p>
            ` : `
            <p>We will contact you shortly via Telegram to confirm your registration and provide you with access to your subscription.</p>
            <p>In the meantime, if you have any questions, please don't hesitate to reach out to us.</p>
            `}
          </div>

          <div class="section">
            <div class="section-title">Contact Information</div>
            <p>
              <strong>Email:</strong> support@sbm-trading.com<br>
              <strong>Telegram:</strong> @SBMTradingChannel<br>
              <strong>Website:</strong> https://sbm-trading.com
            </p>
          </div>

          <div class="footer">
            <p>This is an automated confirmation email. Please do not reply directly to this email.</p>
            <p>&copy; 2024 SBM Trading Channel. All rights reserved.</p>
          </div>

          <!-- Arabic Section -->
          <div class="divider"></div>
          <div class="ar-text">
            <h2 style="text-align: right; color: #1a73e8;">أهلا وسهلا بك في قناة SBM للتداول</h2>

            <div class="section">
              <p>السيد/السيدة <strong>${data.name}</strong>,</p>
              <p>شكرا لتسجيلك في قناة SBM للتداول. نحن سعداء بانضمامك إلينا!</p>
            </div>

            <div class="section">
              <div class="section-title" style="text-align: right;">تفاصيل التسجيل</div>
              <table class="details-table" style="text-align: right;">
                <tr>
                  <td style="text-align: right;">الاسم:</td>
                  <td>${data.name}</td>
                </tr>
                <tr>
                  <td style="text-align: right;">البريد الإلكتروني:</td>
                  <td>${data.email}</td>
                </tr>
                <tr>
                  <td style="text-align: right;">البرنامج:</td>
                  <td>${isProfitPlan ? 'خطة الربح' : 'اشتراك القناة'}</td>
                </tr>
                ${!isProfitPlan ? `
                <tr>
                  <td style="text-align: right;">نوع القناة:</td>
                  <td>${data.channelType || 'غير محدد'}</td>
                </tr>
                <tr>
                  <td style="text-align: right;">المدة:</td>
                  <td>${data.subscriptionDuration || 'غير محددة'}</td>
                </tr>
                ` : `
                <tr>
                  <td style="text-align: right;">مبلغ الخطة:</td>
                  <td>${planLabel}</td>
                </tr>
                `}
              </table>
            </div>

            ${isGoldChannel ? `
            <div class="section" style="background-color: #fff3cd; border: 2px solid #ffc107; padding: 20px; border-radius: 5px; margin: 20px 0; direction: rtl; text-align: right;">
              <div class="section-title" style="color: #856404; border-color: #856404; text-align: right;">🔑 رابط الوصول إلى قناة الذهب</div>
              <p style="font-size: 14px; margin: 15px 0; text-align: right;">
                قناتك الحصرية بالذهب جاهزة الآن! انقر على الرابط أدناه للانضمام إلى قناتنا الخاصة على تليجرام وابدأ بتلقي إشارات التداول المتميزة:
              </p>
              <div style="text-align: center; margin: 20px 0;">
                <a href="${telegramLink}" style="display: inline-block; background-color: #0088cc; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">
                  🔗 انضم إلى قناة الذهب على تليجرام
                </a>
              </div>
              <p style="font-size: 12px; color: #666; margin: 15px 0; text-align: right;">
                <strong>الرابط المباشر:</strong> <a href="${telegramLink}" style="color: #0088cc; text-decoration: underline;">${telegramLink}</a>
              </p>
            </div>
            ` : ''}

            <div class="section">
              <div class="section-title" style="text-align: right;">الخطوات التالية</div>
              ${isGoldChannel ? `
              <p><strong>قناة الذهب الخاصة بك جاهزة!</strong></p>
              <p>يمكنك الآن الانضمام إلى قناتنا الحصرية على تليجرام للوصول إلى إشارات تداول متميزة والتحليلات الفنية.</p>
              <p style="margin: 15px 0; text-align: right;">
                <a href="${telegramLink}" style="display: inline-block; background-color: #0088cc; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">انضم إلى قناة الذهب على تليجرام</a>
              </p>
              <p>إذا واجهت أي مشاكل في الانضمام إلى القناة، يرجى التواصل مع فريق الدعم لدينا.</p>
              ` : `
              <p>سيتصل بك فريقنا قريبا عبر تطبيق تليجرام لتأكيد تسجيلك وتزويدك بإمكانية الوصول إلى الاشتراك.</p>
              <p>إذا كان لديك أي أسئلة، يرجى عدم التردد في التواصل معنا.</p>
              `}
            </div>

            <div class="section">
              <div class="section-title" style="text-align: right;">معلومات الاتصال</div>
              <p style="text-align: right;">
                <strong>البريد الإلكتروني:</strong> support@sbm-trading.com<br>
                <strong>تليجرام:</strong> @SBMTradingChannel<br>
                <strong>الموقع الإلكتروني:</strong> https://sbm-trading.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Send confirmation email
export async function sendConfirmationEmail(data: ConfirmationEmailData, logger?: any): Promise<boolean> {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM || 'SBM Trading Channel <noreply@sbm-trading.com>',
      to: data.email,
      subject: 'Registration Confirmation - SBM Trading Channel | تأكيد التسجيل - قناة SBM للتداول',
      html: generateEmailHTML(data),
    };

    const info = await transporter.sendMail(mailOptions);

    if (logger) {
      logger.info({ messageId: info.messageId, email: data.email }, 'Confirmation email sent successfully');
    }

    return true;
  } catch (error) {
    if (logger) {
      logger.error({ err: error, email: data.email }, 'Failed to send confirmation email');
    } else {
      console.error('Failed to send confirmation email:', error);
    }
    // Don't throw - allow the registration to succeed even if email fails
    return false;
  }
}

// Test email connection
export async function testEmailConnection(logger?: any): Promise<boolean> {
  try {
    await transporter.verify();
    if (logger) {
      logger.info('Email service connection verified');
    }
    return true;
  } catch (error) {
    if (logger) {
      logger.warn({ err: error }, 'Email service not properly configured');
    } else {
      console.warn('Email service not properly configured:', error);
    }
    return false;
  }
}

// Interface for channel subscription email
export interface ChannelSubscriptionEmailData {
  subscriberName: string;
  subscriberEmail: string;
  telegramUsername: string;
  channelType: string; // 'gold', 'forex', 'analysis'
  subscriptionDuration: string; // '1_month', '3_months', '12_months'
  subscriptionStartDate: Date;
  subscriptionEndDate: Date;
  totalMonths: number;
}

// Get Telegram channel link based on channel type
function getTelegramChannelLink(channelType: string): string {
  const channelLower = channelType.toLowerCase();
  const links: { [key: string]: string } = {
    'gold': process.env.TELEGRAM_GOLD_CHANNEL_INVITE || 'https://t.me/+9ckhkN9-kfJjZDk8',
    'forex': process.env.TELEGRAM_FOREX_CHANNEL_INVITE || 'https://t.me/SBMForexChannel',
    'analysis': process.env.TELEGRAM_ANALYSIS_CHANNEL_INVITE || 'https://t.me/SBMAnalysisChannel',
  };
  return links[channelLower] || links['gold'];
}

// Format date for display
function formatDate(date: Date, locale: 'en' | 'ar' = 'en'): string {
  if (locale === 'ar') {
    const arabicMonths = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    const month = arabicMonths[date.getMonth()];
    return `${date.getDate()} ${month} ${date.getFullYear()}`;
  }
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

// Generate channel subscription confirmation email
function generateChannelSubscriptionEmailHTML(data: ChannelSubscriptionEmailData): string {
  const telegramLink = getTelegramChannelLink(data.channelType);
  const channelTypeLabel = data.channelType.charAt(0).toUpperCase() + data.channelType.slice(1);
  const startDateEn = formatDate(data.subscriptionStartDate, 'en');
  const endDateEn = formatDate(data.subscriptionEndDate, 'en');
  const startDateAr = formatDate(data.subscriptionStartDate, 'ar');
  const endDateAr = formatDate(data.subscriptionEndDate, 'ar');

  return `
    <!DOCTYPE html>
    <html lang="en" dir="ltr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; }
        .header { background: linear-gradient(135deg, #1a73e8 0%, #0d47a1 100%); color: white; padding: 30px; text-align: center; border-radius: 5px 5px 0 0; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { background-color: white; padding: 30px; border: 1px solid #ddd; border-radius: 0 0 5px 5px; }
        .section { margin: 20px 0; }
        .section-title { font-size: 16px; font-weight: bold; color: #1a73e8; margin-bottom: 10px; border-bottom: 2px solid #1a73e8; padding-bottom: 5px; }
        .details-table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        .details-table td { padding: 10px; border-bottom: 1px solid #eee; }
        .details-table td:first-child { font-weight: bold; width: 45%; background-color: #f5f5f5; }
        .cta-button { display: inline-block; background-color: #0088cc; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 15px 0; font-size: 16px; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; }
        .ar-text { direction: rtl; text-align: right; margin-top: 40px; padding-top: 20px; border-top: 2px solid #ddd; }
        .divider { height: 2px; background-color: #eee; margin: 30px 0; }
        .highlight { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 15px 0; border-radius: 3px; }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- ENGLISH SECTION -->
        <div class="header">
          <h1>✅ Subscription Confirmed</h1>
          <p>Your ${channelTypeLabel} Channel is Active</p>
        </div>

        <div class="content">
          <div class="section">
            <p>Hello <strong>${data.subscriberName}</strong>,</p>
            <p>Thank you for subscribing to the SBM Trading ${channelTypeLabel} Channel! Your subscription is now active.</p>
          </div>

          <div class="section">
            <div class="section-title">Subscription Details</div>
            <table class="details-table">
              <tr>
                <td>Channel Type:</td>
                <td>${channelTypeLabel}</td>
              </tr>
              <tr>
                <td>Start Date:</td>
                <td>${startDateEn}</td>
              </tr>
              <tr>
                <td>End Date:</td>
                <td>${endDateEn}</td>
              </tr>
              <tr>
                <td>Duration:</td>
                <td>${data.totalMonths} Month${data.totalMonths > 1 ? 's' : ''}</td>
              </tr>
              <tr>
                <td>Telegram Username:</td>
                <td>@${data.telegramUsername}</td>
              </tr>
            </table>
          </div>

          <div class="highlight">
            <strong>📱 Access Your Channel</strong><br>
            Click the button below to join the ${channelTypeLabel} Channel on Telegram and start receiving premium trading signals and analysis.
          </div>

          <div style="text-align: center;">
            <a href="${telegramLink}" class="cta-button">
              🔗 Join ${channelTypeLabel} Channel
            </a>
          </div>

          <div class="section">
            <p><strong>Direct Link:</strong></p>
            <p><a href="${telegramLink}" style="color: #0088cc; text-decoration: underline;">${telegramLink}</a></p>
          </div>

          <div class="section">
            <div class="section-title">What's Next?</div>
            <p>• Your subscription is active and you can start receiving trading signals immediately</p>
            <p>• Join our Telegram channel using the link above</p>
            <p>• If you have any questions, contact our support team</p>
          </div>

          <div class="footer">
            <p>&copy; 2024 SBM Trading Channel. All rights reserved.</p>
            <p>Email: support@sbm-trading.com | Telegram: @SBMTradingChannel</p>
          </div>
        </div>

        <!-- ARABIC SECTION -->
        <div class="divider"></div>

        <div class="ar-text">
          <div class="header" style="text-align: center;">
            <h1>✅ تم تأكيد الاشتراك</h1>
            <p>قناة ${channelTypeLabel} الخاصة بك نشطة</p>
          </div>

          <div class="content">
            <div class="section">
              <p>السلام عليكم <strong>${data.subscriberName}</strong>,</p>
              <p>شكراً لك على الاشتراك في قناة SBM Trading ${channelTypeLabel}! اشتراكك نشط الآن.</p>
            </div>

            <div class="section">
              <div class="section-title" style="text-align: right;">تفاصيل الاشتراك</div>
              <table class="details-table" style="text-align: right;">
                <tr>
                  <td style="text-align: right;">نوع القناة:</td>
                  <td>${channelTypeLabel}</td>
                </tr>
                <tr>
                  <td style="text-align: right;">تاريخ البداية:</td>
                  <td>${startDateAr}</td>
                </tr>
                <tr>
                  <td style="text-align: right;">تاريخ الانتهاء:</td>
                  <td>${endDateAr}</td>
                </tr>
                <tr>
                  <td style="text-align: right;">المدة:</td>
                  <td>${data.totalMonths} شهر</td>
                </tr>
                <tr>
                  <td style="text-align: right;">اسم المستخدم في تليجرام:</td>
                  <td>@${data.telegramUsername}</td>
                </tr>
              </table>
            </div>

            <div class="highlight" style="text-align: right; direction: rtl;">
              <strong>📱 الوصول إلى القناة الخاصة بك</strong><br>
              انقر على الزر أدناه للانضمام إلى قناة ${channelTypeLabel} على تليجرام وابدأ بتلقي إشارات التداول والتحليلات المتميزة.
            </div>

            <div style="text-align: center;">
              <a href="${telegramLink}" class="cta-button">
                🔗 انضم إلى قناة ${channelTypeLabel}
              </a>
            </div>

            <div class="section" style="text-align: right;">
              <p><strong>الرابط المباشر:</strong></p>
              <p><a href="${telegramLink}" style="color: #0088cc; text-decoration: underline;">${telegramLink}</a></p>
            </div>

            <div class="section">
              <div class="section-title" style="text-align: right;">الخطوات التالية</div>
              <p style="text-align: right;">• اشتراكك نشط ويمكنك بدء تلقي إشارات التداول على الفور</p>
              <p style="text-align: right;">• انضم إلى قناتنا على تليجرام باستخدام الرابط أعلاه</p>
              <p style="text-align: right;">• إذا كان لديك أي أسئلة، يرجى التواصل مع فريق الدعم</p>
            </div>

            <div class="footer" style="text-align: right;">
              <p>&copy; 2024 SBM Trading Channel. جميع الحقوق محفوظة.</p>
              <p>البريد الإلكتروني: support@sbm-trading.com | تليجرام: @SBMTradingChannel</p>
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Send channel subscription confirmation email
export async function sendChannelSubscriptionEmail(data: ChannelSubscriptionEmailData, logger?: any): Promise<boolean> {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM || 'SBM Trading Channel <noreply@sbm-trading.com>',
      to: data.subscriberEmail,
      subject: `Channel Subscription Confirmed - ${data.channelType.toUpperCase()} | تم تأكيد الاشتراك في القناة`,
      html: generateChannelSubscriptionEmailHTML(data),
    };

    const info = await transporter.sendMail(mailOptions);

    if (logger) {
      logger.info({ messageId: info.messageId, email: data.subscriberEmail, channelType: data.channelType }, 'Channel subscription confirmation email sent successfully');
    }

    return true;
  } catch (error) {
    if (logger) {
      logger.error({ err: error, email: data.subscriberEmail }, 'Failed to send channel subscription confirmation email');
    } else {
      console.error('Failed to channel subscription confirmation email:', error);
    }
    return false;
  }
}

// Generate admin notification email
function generateAdminNotificationEmailHTML(data: ChannelSubscriptionEmailData): string {
  const startDateEn = formatDate(data.subscriptionStartDate, 'en');
  const endDateEn = formatDate(data.subscriptionEndDate, 'en');
  const startDateAr = formatDate(data.subscriptionStartDate, 'ar');
  const endDateAr = formatDate(data.subscriptionEndDate, 'ar');

  return `
    <!DOCTYPE html>
    <html lang="en" dir="ltr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 700px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; }
        .header { background-color: #d32f2f; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
        .content { background-color: white; padding: 30px; border: 1px solid #ddd; border-radius: 0 0 5px 5px; }
        .alert { background-color: #fff3cd; border: 2px solid #ffc107; padding: 15px; margin: 15px 0; border-radius: 3px; }
        .section { margin: 20px 0; }
        .section-title { font-size: 16px; font-weight: bold; color: #d32f2f; margin-bottom: 10px; border-bottom: 2px solid #d32f2f; padding-bottom: 5px; }
        .details-table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        .details-table td { padding: 10px; border-bottom: 1px solid #eee; }
        .details-table td:first-child { font-weight: bold; width: 45%; background-color: #f5f5f5; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; }
        .ar-text { direction: rtl; text-align: right; margin-top: 40px; padding-top: 20px; border-top: 2px solid #ddd; }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- ENGLISH SECTION -->
        <div class="header">
          <h1>🔔 New Subscription Alert</h1>
        </div>

        <div class="content">
          <div class="alert">
            <strong>⚠️ A new subscription has been registered in the system.</strong>
          </div>

          <div class="section">
            <div class="section-title">Subscriber Information</div>
            <table class="details-table">
              <tr>
                <td>Name:</td>
                <td>${data.subscriberName}</td>
              </tr>
              <tr>
                <td>Email:</td>
                <td>${data.subscriberEmail}</td>
              </tr>
              <tr>
                <td>Telegram Username:</td>
                <td>@${data.telegramUsername}</td>
              </tr>
            </table>
          </div>

          <div class="section">
            <div class="section-title">Subscription Details</div>
            <table class="details-table">
              <tr>
                <td>Channel Type:</td>
                <td><strong>${data.channelType.toUpperCase()}</strong></td>
              </tr>
              <tr>
                <td>Duration:</td>
                <td>${data.totalMonths} Month${data.totalMonths > 1 ? 's' : ''}</td>
              </tr>
              <tr>
                <td>Start Date:</td>
                <td>${startDateEn}</td>
              </tr>
              <tr>
                <td>End Date:</td>
                <td>${endDateEn}</td>
              </tr>
            </table>
          </div>

          <div class="footer">
            <p>This is an automated notification from the SBM Trading system.</p>
            <p>Timestamp: ${new Date().toISOString()}</p>
          </div>
        </div>

        <!-- ARABIC SECTION -->
        <div class="ar-text">
          <div class="header" style="text-align: center;">
            <h1>🔔 تنبيه اشتراك جديد</h1>
          </div>

          <div class="content">
            <div class="alert" style="text-align: right;">
              <strong>⚠️ تم تسجيل اشتراك جديد في النظام.</strong>
            </div>

            <div class="section">
              <div class="section-title" style="text-align: right;">معلومات المشترك</div>
              <table class="details-table" style="text-align: right;">
                <tr>
                  <td style="text-align: right;">الاسم:</td>
                  <td>${data.subscriberName}</td>
                </tr>
                <tr>
                  <td style="text-align: right;">البريد الإلكتروني:</td>
                  <td>${data.subscriberEmail}</td>
                </tr>
                <tr>
                  <td style="text-align: right;">اسم المستخدم في تليجرام:</td>
                  <td>@${data.telegramUsername}</td>
                </tr>
              </table>
            </div>

            <div class="section">
              <div class="section-title" style="text-align: right;">تفاصيل الاشتراك</div>
              <table class="details-table" style="text-align: right;">
                <tr>
                  <td style="text-align: right;">نوع القناة:</td>
                  <td><strong>${data.channelType.toUpperCase()}</strong></td>
                </tr>
                <tr>
                  <td style="text-align: right;">المدة:</td>
                  <td>${data.totalMonths} شهر</td>
                </tr>
                <tr>
                  <td style="text-align: right;">تاريخ البداية:</td>
                  <td>${startDateAr}</td>
                </tr>
                <tr>
                  <td style="text-align: right;">تاريخ الانتهاء:</td>
                  <td>${endDateAr}</td>
                </tr>
              </table>
            </div>

            <div class="footer" style="text-align: right;">
              <p>هذا إشعار مؤتمت من نظام SBM Trading.</p>
              <p>الطابع الزمني: ${new Date().toISOString()}</p>
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Send admin notification email
export async function sendAdminNotificationEmail(data: ChannelSubscriptionEmailData, logger?: any): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL_NOTIFICATION;

  if (!adminEmail) {
    if (logger) {
      logger.warn({}, 'Admin email not configured for notifications');
    }
    return false;
  }

  try {
    const mailOptions = {
      from: process.env.SMTP_FROM || 'SBM Trading Channel <noreply@sbm-trading.com>',
      to: adminEmail,
      subject: `New Subscription Alert - ${data.channelType.toUpperCase()} | تنبيه اشتراك جديد`,
      html: generateAdminNotificationEmailHTML(data),
    };

    const info = await transporter.sendMail(mailOptions);

    if (logger) {
      logger.info({ messageId: info.messageId, adminEmail, channelType: data.channelType }, 'Admin notification email sent successfully');
    }

    return true;
  } catch (error) {
    if (logger) {
      logger.error({ err: error, adminEmail }, 'Failed to send admin notification email');
    } else {
      console.error('Failed to send admin notification email:', error);
    }
    return false;
  }
}
