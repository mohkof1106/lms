// Terms & Agreements content - English and Arabic
// Based on the example PDF

export interface TermsSection {
  id: string;
  titleEn: string;
  titleAr: string;
  contentEn: string;
  contentAr: string;
}

export const termsIntroEn = `We will always do our best to fulfill your needs and meet your goals, but sometimes it is best to have a few simple things written down so that we both know what is what, who should do what and what happens if things go wrong. In this document, you won't find complicated legal terms or large passages of unreadable text. We have no desire to trick you into getting in something that you might later regret. We do want what's best for the safety of both parties, now and in the future.

By using our services or starting a project with us, you agree to be bound by these Terms of Agreements:`;

export const termsIntroAr = `سنبذل قصارى جهدنا لتلبية الاحتياجات الخاصة بك وتحقيق أهدافك، ولكن أحيانا يكون من الأفضل أن تكون هناك بنود موثقة بين الطرفين من أجل تحقيق العدالة وعدم ضياع حقوق طرف على حساب الطرف الآخر. في هذه الوثيقة لن تجد المصطلحات القانونية المعقدة أو مقاطع كبيرة من النص غير قابل للقراءة، لأننا لا نقصد خداعك أو تضليلك، بل نريد ما هو أفضل لسلامة كل من الطرفين في الحاضر و المستقبل.

بمجرد استخدام خدماتنا أو البدء في مشروع معنا، فإنك توافق على الإلتزام بهذه الشروط و الاتفاقيات:`;

export const termsSections: TermsSection[] = [
  {
    id: 'project',
    titleEn: '1.1 Description of the Project',
    titleAr: '1.1 وصف المشروع',
    contentEn: `LOR Computer Designing Company agrees to work/develop the Project as per the specifications described in the attached quotation.`,
    contentAr: `تلتزم شركة لور للتصميم بالحاسب الآلي للعمل أو تطوير المشروع وفقا للمواصفات الموضحة في الفاتورة المرفقة.`,
  },
  {
    id: 'payment',
    titleEn: '1.2 Payment and Invoices',
    titleAr: '2.1 آلية الدفع',
    contentEn: `Down payment of 50% of the overall price is required before starting any design unless there is an official stamped Purchase Order (PO) released from the client. All invoices are payable within 30 days of receipt. Client shall be responsible for all collection or legal fees necessitated by lateness or default in payment. We reserve the right to withhold delivery and any transfer of ownership of any current work if accounts are not current or overdue invoices are not paid in full.`,
    contentAr: `يتم دفع نصف قيمة الفاتورة كدفعة أولى من السعر الإجمالي قبل البدء في أي تصميم، الا اذا كان هناك ورقة طلب شراء (PO) مختومة من طرف العميل. جميع الفواتير مستحقة الدفع في غضون 30 يوما من تسلمها. يتحمل العميل مسؤولية جميع الرسوم القانونية الناتجة عن تأخر أو التخلف عن سداد الفواتير. شركة لور للتصميم بالحاسب الآلي تحتفظ بالحق في الامتناع عن تسليم او نقل ملكية أي عمل إذا لم يتم دفع الحسابات أو لم يتم دفع الفواتير المتأخرة بالكامل.`,
  },
  {
    id: 'editing',
    titleEn: '1.3 Additional Editing & Changes',
    titleAr: '3.1 إضافة تعديل أو تغييرات',
    contentEn: `We know from experience that fixed-price contracts are rarely beneficial to you, as they often limit you to your first idea about how something should look, or how it might work. We don't want to limit either your options or your opportunities to change your mind. Therefore, first two edit requests will be free of charge and any change or edit requests after that will be charged based on hourly rate (120 AED per hour) or as agreed price between both parties in the quotation. Taking into consideration that each change request or edit will not be more than 15% of the total project working hours. All additional changes must be submitted and approved by both parties in writing by approved Contract Change form.`,
    contentAr: `نحن نعلم من الخبرة أن العقود ذات السعر الثابت نادرا ما تكون مفيدة لك، لأنها غالبا ما تكون مخصصة لفكرتك الاولى، لأننا لا نريد الحد من خياراتك أو فرصك لتغيير فكرتك الأولى. لذلك فإن أول طلبين لإضافة تعديل او تغيير على التصميم تكون خالية من الرسوم، وبعد ذلك سيتم فرض رسوم على أساس الأجر بالساعة (120 درهم إماراتي للساعة الواحدة) أو حسب السعر المتفق عليه بين الطرفين. على ان لا يتعدى حجم التعديل او التغير الواحد عن 15% من اجمالي عدد ساعات عمل المشروع. يجب تقديم وتوثيق جميع التغييرات الإضافية التي وافق عليها كلا الطرفين خطيا.`,
  },
  {
    id: 'text',
    titleEn: '1.4 Text content',
    titleAr: '4.1 محتوى النص',
    contentEn: `Content writing or inputting any text copy is out of our scope of work unless we specified it in the original quotation. Client is responsible for any content or text provided to us therefore LOR Computer Designing will not be responsible for any legal issues related to copy writing or intellectual property rights.`,
    contentAr: `لا يشمل هذا الاتفاق كتابة المحتوى أو إدخال أي نسخة من النص إلا إذا كان متفق عليه بين الطرفين، وسوف تكون سعداء جدا للمساعدة رغم ذلك، يتحمل العميل المسؤولية عن أي نص مقدم لنا وبالتالي فإن شركة لور للتصميم بالحاسب الآلي لن تكون مسؤولة عن المسائل القانونية المتعلقة بنسخ الكتابة أو حقوق الملكية الفكرية أو حقوق الطبع والنشر.`,
  },
  {
    id: 'photographs',
    titleEn: '1.5 Photographs',
    titleAr: '5.1 الصور',
    contentEn: `Client will supply us with photographs in digital. If you choose to buy stock photographs we can suggest vendors of stock photography or help in purchasing at an additional cost or as agreed in the original estimate.

We don't accept low quality pictures because it will impact your quality of design and it will impact our image as a company. However, we can help enhance the quality of pictures as much as we can. And we might suggest to you some online websites or help purchasing stock photos at additional cost or on your agreed upon cost.`,
    contentAr: `يلتزم العميل بتزويد الصور الخاصة بالتصميم (إلكترونيا)، على ان تكون الصور عالية الجودة، وإن لم تتوفر فسنعمل على تقديمها في أفضل جودة ممكنة.

نحن لا نقبل صور ذات جودة منخفضة لأنها سوف تؤثر على نوعية التصميم الخاص بك وسمعتنا كشركة، ومع ذلك، يمكننا أن نساعد في تحسين نوعية الصور بقدر ما نستطيع. وأن نقترح عليك بعض المواقع الإلكترونية أو المساعدة في شراء الصور بتكلفة إضافية أو على النحو المتفق عليه.`,
  },
  {
    id: 'ip',
    titleEn: '1.6 Intellectual Property',
    titleAr: '6.1 الملكية الفكرية',
    contentEn: `Intellectual property (IP) refers to creations of the mind, such as inventions; literary and artistic works, designs, symbols, names and images used in the project, and therefore the intellectual property rights of the project will belong to LOR Computer Designing until full payment is made.`,
    contentAr: `تشير الملكية الفكرية (IP) إلى إبداعات العقل، مثل الاختراعات، والمصنفات الأدبية والفنية، والتصاميم والرموز والأسماء والصور المستخدمة في المشروع، وبالتالي فإن حقوق الملكية الفكرية تنتمي إلى شركة لور للتصميم بالحاسب الآلي حتى يتم دفع وسداد جميع الفواتير كاملة.`,
  },
  {
    id: 'copyrights',
    titleEn: '1.7 Copyrights',
    titleAr: '7.1 حقوق التأليف والنشر',
    contentEn: `Client guarantee to LOR Computer Designing that any elements of text, graphics, photos, designs, trademarks, or other artwork that client provide are either owned by the client or that the client has permission to use them. Copy rights of the photographs purchased through LOR Computer Designing from online websites will fall under the terms and conditions of the website itself.`,
    contentAr: `يضمن العميل أن أي من عناصر النص، والرسومات والصور والتصاميم والعلامات التجارية، أو غيرها من الأعمال الفنية التي قدمت إلى لور للتصميم بالحاسب الآلي مملوكة من قبل العميل أو أن لديه إذن لاستخدامها.

تعود حقوق الملكية الفكرية والطبع والنشر المتعلقة بالصور التي تم شراؤها من المواقع الالكترونية الى الموقع الإلكتروني نفسه، وكذلك تنطبق الشروط والأحكام المتعلقة بالصور كما هو في الموقع.`,
  },
  {
    id: 'cancellation',
    titleEn: '1.8 Cancellation',
    titleAr: '8.1 إلغاء المشروع',
    contentEn: `If after project commencement client communication (face-to-face, telephone, or email) stops for a period of 180 days, the project can be cancelled, in writing by LOR Computer Designing Company, and ownership of all copyrights shall be retained by the designer. A cancellation fee for work completed shall be paid by the client, with the fee based on the stage of project completion.`,
    contentAr: `يحق لشركة لور للتصميم بالحاسب الآلي إلغاء المشروع إذا توقف العميل عن الاتصال (وجها لوجه ، أو بالهاتف، أو بالبريد الإلكتروني ) لمدة 180 يوما وبذلك تعود الملكية الفكرية إلى شركة لور للتصميم بالحاسب الالي.

يجب أن تدفع رسوم الإلغاء للعمل المنجز من قبل العميل على حسب ما هو مكتمل من المشروع.`,
  },
  {
    id: 'samples',
    titleEn: '1.9 Samples',
    titleAr: '9.1 النماذج',
    contentEn: `LOR Computer Designing Company can use samples or photographs of the work created under this agreement for publications, exhibition, competition and other promotional purposes (such as our website) once the project has been made public. Unless the project is confidential and there has been an agreement between the two parties not to share the data outside the relationship.`,
    contentAr: `تحتفظ شركة لور للتصميم بالحاسب الآلي بالحق في عرض المشاريع في موقعها الإلكتروني أو المعارض وغيرها ما دامت هذه المشاريع خاصة وسرية للغاية وذلك حسب ما هو متفق عليه.`,
  },
];

export const signatureNote = {
  en: 'Everyone should sign above and keep a copy for their own records.',
  ar: 'يجب أن يوقع الجميع أعلاه والاحتفاظ بنسخة عن السجلات الخاصة بها.',
};

export const partyLabels = {
  firstParty: {
    en: 'LOR Signature',
    ar: 'الطرف الاول:',
  },
  secondParty: {
    en: 'Customer Signature',
    ar: 'الطرف الثاني:',
  },
};
