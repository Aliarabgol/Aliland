// Service pages. All content is portfolio demo copy — no real service, financing
// approval, warranty or partnership is implied by anything written here.

const s = (title_fa, title_en, body_fa, body_en) => ({ title_fa, title_en, body_fa, body_en });
const f = (q_fa, q_en, a_fa, a_en) => ({ q_fa, q_en, a_fa, a_en });

export const services = [
  {
    slug: 'buy',
    number: '۰۱',
    title_fa: 'خرید خودرو',
    title_en: 'Buying a car',
    kicker_fa: 'از کوتاه‌کردن فهرست تا تصمیم نهایی',
    kicker_en: 'From a long list to a decision',
    intro_fa:
      'خرید خودرو در ایران بیشتر از یک معامله، یک فرایند تصمیم‌گیری است: بودجه، کارکرد، قطعات، بازار دست‌دوم و انتظار خانواده باید کنار هم بنشینند. علی‌لند این فهرست را مرحله‌به‌مرحله کوتاه می‌کند.',
    intro_en:
      'Buying a car is a decision process rather than a single transaction: budget, running costs, parts, resale and family needs all have to agree. AliLand shortens that list step by step.',
    problem_fa:
      'مشکل معمول این است: ده آگهی می‌بینید، هر کدام یک چیز کم دارد و هیچ‌کدام با بودجه واقعی شما هم‌خوان نیست. مقایسه در ذهن انجام می‌شود و نتیجه‌اش حدس است.',
    problem_en:
      'The usual problem: ten listings, each missing something, and none matching the real budget. The comparison happens in your head, and the result is a guess.',
    value_fa:
      'اینجا مشخصات کنار هم گذاشته می‌شود، تفاوت‌ها پنهان نمی‌مانند و هر پیشنهاد با یک دلیل مشخص کنار گذاشته یا انتخاب می‌شود. تصمیم شما بر پایه جدول است، نه حس لحظه‌ای.',
    value_en:
      'Specifications sit side by side, differences stay visible, and every option is kept or dropped for a stated reason. The decision rests on a table, not on the moment.',
    steps: [
      s('تعیین محدوده واقعی', 'Set the real range', 'بودجه خرید، بودجه نگهداری سالانه و کارکرد روزانه را جدا مشخص می‌کنیم.', 'We separate purchase budget, yearly running cost and daily mileage.'),
      s('کوتاه‌کردن فهرست', 'Shorten the list', 'با فیلترهای دسته‌بندی، بدنه، سوخت و گیربکس به سه تا پنج گزینه می‌رسیم.', 'Category, body, fuel and gearbox filters bring you to three to five candidates.'),
      s('مقایسه کنار هم', 'Compare side by side', 'حداکثر سه خودرو را در یک جدول با مشخصات واقعی ثبت‌شده مقایسه می‌کنید.', 'Up to three vehicles in one table, using the stored attributes.'),
      s('بررسی نهایی', 'Final check', 'فهرست مواردی که باید حضوری دیده شود آماده می‌شود؛ از رنگ بدنه تا تاریخ لاستیک.', 'A checklist for the in-person look is prepared — paint, tyres, service history.'),
    ],
    faq: [
      f('آیا خودروها واقعی هستند؟', 'Are the vehicles real?', 'نه. تمام فهرست خودروهای این نسخه داده نمونه است و برای نمایش تجربه کاربری ساخته شده.', 'No. Every listing here is synthetic sample data built to demonstrate the experience.'),
      f('قیمت‌ها به‌روز است؟', 'Are the prices current?', 'قیمت‌ها نمونه و ساختگی‌اند و به هیچ بازار واقعی متصل نیستند.', 'Prices are fictional samples and are not connected to any real market.'),
    ],
    tone: 'ivory',
    cta_href: '/vehicles',
    sort_weight: 1,
  },
  {
    slug: 'sell',
    number: '۰۲',
    title_fa: 'فروش خودرو',
    title_en: 'Selling a car',
    kicker_fa: 'قیمت درست، ارائه درست',
    kicker_en: 'The right price, presented properly',
    intro_fa:
      'فروش سریع معمولاً به قیمت ارزان تمام می‌شود و قیمت بالا معمولاً به انتظار طولانی. کاری که می‌شود کرد این است که خودرو دقیق توصیف شود و قیمت با نمونه‌های مشابه سنجیده شود.',
    intro_en:
      'A fast sale usually costs money, and a high price usually costs time. What can be fixed is accurate description and pricing benchmarked against comparable cars.',
    problem_fa:
      'بیشتر آگهی‌ها با «فول، بدون رنگ» شروع می‌شوند و با سؤالاتی تمام می‌شوند که در متن نبود. خریدار وقت می‌گذارد تا چیزی را بفهمد که از اول باید نوشته می‌شد.',
    problem_en:
      'Most listings open with superlatives and end in questions the text never answered. A buyer spends time learning what should have been stated.',
    value_fa:
      'فرم چندمرحله‌ای فروش، شما را مجبور می‌کند کارکرد، وضعیت بدنه و تجهیزات را دقیق ثبت کنید؛ همان چیزی که خریدار جدی می‌خواهد.',
    value_en:
      'The multi-step sell form makes you record mileage, body condition and equipment precisely — exactly what a serious buyer wants first.',
    steps: [
      s('ثبت مشخصات', 'Record the spec', 'برند، مدل، تیپ و سال را انتخاب می‌کنید؛ فیلدهای بعدی بر همان اساس باز می‌شوند.', 'Pick make, model, trim and year; the following fields depend on them.'),
      s('وضعیت واقعی', 'State the truth', 'کارکرد، رنگ بدنه و وضعیت فنی را همان‌طور که هست ثبت می‌کنید.', 'Mileage, paint and mechanical condition are recorded as they are.'),
      s('قیمت پیشنهادی', 'Suggest a price', 'یک بازه نمونه بر اساس خودروهای مشابه همین فهرست می‌بینید.', 'A sample range is shown from comparable cars in this listing set.'),
      s('بازبینی نهایی', 'Review', 'خلاصه را یک بار می‌خوانید و پیش‌نویس در مرورگر شما نگه داشته می‌شود.', 'Read the summary once; your draft is kept in the browser.'),
    ],
    faq: [
      f('اطلاعات من ارسال می‌شود؟', 'Is my information sent?', 'در این نسخه نمایشی، فرم فروش کاملاً شبیه‌سازی‌شده است و درخواست شما برای هیچ کسی ارسال نمی‌شود.', 'In this demo the sell form is fully simulated; your submission goes to nobody.'),
      f('می‌توانم بعداً ادامه بدهم؟', 'Can I finish later?', 'بله، پیش‌نویس فرم در همان مرورگر ذخیره می‌شود.', 'Yes — the draft is stored in the same browser.'),
    ],
    tone: 'ink',
    cta_href: '/sell',
    sort_weight: 2,
  },
  {
    slug: 'inspection',
    number: '۰۳',
    title_fa: 'کارشناسی خودرو',
    title_en: 'Vehicle inspection',
    kicker_fa: 'آنچه از روی عکس دیده نمی‌شود',
    kicker_en: 'What a photo cannot show',
    intro_fa:
      'یک خودرو می‌تواند در عکس بی‌نقص باشد و در بازدید، سه مورد اصلاح رنگ داشته باشد. کارشناسی یعنی همین فاصله را کم کردن.',
    intro_en:
      'A car can look flawless in photos and show three repainted panels in person. Inspection exists to close that gap.',
    problem_fa:
      'خریدار معمولاً نمی‌داند کجا را نگاه کند: زیر آستانه درها، پیچ‌های گلگیر، تاریخ لاستیک و لبه شاسی؛ همان نقاطی که هزینه آینده را تعیین می‌کنند.',
    problem_en:
      'A buyer often does not know where to look: under door sills, around wing bolts, tyre date codes, chassis edges — the places that decide future cost.',
    value_fa:
      'این بخش یک چک‌لیست قابل فهم می‌دهد؛ نه ادعای تأییدیه رسمی. هر مورد با یک توضیح کوتاه که چرا اهمیت دارد.',
    value_en:
      'This section gives a readable checklist — not a claim of official certification. Each point comes with a short reason it matters.',
    steps: [
      s('شناسه خودرو', 'Identify the car', 'شماره شاسی، پلاک و سال ساخت با مدارک تطبیق داده می‌شود.', 'VIN, plate and build year are matched against the documents.'),
      s('بدنه و رنگ', 'Body and paint', 'ضخامت رنگ، فاصله درزها و نشانه‌های تعویض پنل بررسی می‌شود.', 'Paint thickness, panel gaps and signs of replaced panels.'),
      s('فنی و زیربندی', 'Mechanical', 'نشتی، صداهای غیرعادی و وضعیت کمک‌فنر و لنت ثبت می‌شود.', 'Leaks, unusual noises, shock absorbers and brake pads.'),
      s('گزارش خوانا', 'Readable report', 'نتیجه به زبان ساده نوشته می‌شود: قابل قبول، نیازمند بررسی، یا رد.', 'Plain-language outcome: acceptable, needs review, or reject.'),
    ],
    faq: [
      f('این کارشناسی رسمی است؟', 'Is this an official inspection?', 'نه. این یک نمونه نمایشی از ساختار گزارش است و هیچ تأییدیه فنی یا رسمی صادر نمی‌کند.', 'No. This is a demo of a report structure; it issues no technical or official certification.'),
      f('چند مورد بررسی می‌شود؟', 'How many points are checked?', 'در این نمونه ۳۲ مورد در چهار گروه بدنه، فنی، کابین و مدارک نمایش داده می‌شود.', 'This sample shows 32 points across body, mechanical, cabin and documents.'),
    ],
    tone: 'steel',
    cta_href: '/contact',
    sort_weight: 3,
  },
  {
    slug: 'valuation',
    number: '۰۴',
    title_fa: 'قیمت‌گذاری خودرو',
    title_en: 'Vehicle valuation',
    kicker_fa: 'یک عدد با دلیل، نه یک حدس',
    kicker_en: 'A number with reasons',
    intro_fa:
      'قیمت‌گذاری خوب به سه چیز نیاز دارد: نمونه‌های قابل مقایسه، وضعیت واقعی خودرو و شفافیت در فرض‌ها.',
    intro_en:
      'Good valuation needs three things: comparable examples, the true condition of the car, and transparency about assumptions.',
    problem_fa:
      'اغلب قیمت‌ها بدون گفتن فرض‌ها اعلام می‌شوند؛ معلوم نیست کارکرد، رنگ شدگی یا تاریخ بیمه در آن عدد لحاظ شده یا نه.',
    problem_en:
      'Prices are often quoted without their assumptions — mileage, repainted panels or insurance history are unstated.',
    value_fa:
      'در این نمونه، هر عامل به‌صورت یک ردیف جدا با اثر مثبت یا منفی نشان داده می‌شود تا بتوانید ببینید عدد از کجا آمده است.',
    value_en:
      'In this sample every factor is its own row with a positive or negative effect, so you can see where the number comes from.',
    steps: [
      s('مشخصات پایه', 'Base spec', 'مدل، تیپ، سال و گیربکس ثبت می‌شود.', 'Model, trim, year and gearbox.'),
      s('کارکرد', 'Mileage', 'کارکرد نسبت به میانگین سالانه همان مدل سنجیده می‌شود.', 'Mileage is compared with the model’s typical annual average.'),
      s('وضعیت', 'Condition', 'بدنه، فنی و کابین جدا امتیاز می‌گیرند.', 'Body, mechanical and cabin are scored separately.'),
      s('بازه نهایی', 'Final range', 'یک بازه با فرض‌های نوشته‌شده اعلام می‌شود.', 'A range is given with its assumptions written down.'),
    ],
    faq: [
      f('قیمت واقعی بازار است؟', 'Is this the real market price?', 'نه. اعداد نمونه‌اند و هیچ اتصالی به داده بازار واقعی وجود ندارد.', 'No. The numbers are samples with no connection to real market data.'),
    ],
    tone: 'bronze',
    cta_href: '/contact',
    sort_weight: 4,
  },
  {
    slug: 'trade-in',
    number: '۰۵',
    title_fa: 'معاوضه خودرو',
    title_en: 'Trade-in',
    kicker_fa: 'تفاوت دو عدد، نه دو معامله',
    kicker_en: 'One difference, not two deals',
    intro_fa:
      'در معاوضه، مهم عدد نهایی نیست؛ مهم فاصله بین ارزش خودروی فعلی شما و خودروی بعدی است.',
    intro_en:
      'In a trade-in the headline price matters less than the gap between your current car and the next one.',
    problem_fa:
      'وقتی فروش و خرید جدا انجام شود، دو بار چانه‌زنی می‌کنید و یک بار هم ریسک زمان‌بندی را می‌پذیرید.',
    problem_en:
      'Selling and buying separately means negotiating twice and absorbing the timing risk once.',
    value_fa:
      'مقایسه دو خودرو در یک صفحه، تفاوت واقعی را نشان می‌دهد: همان عددی که باید پرداخت شود.',
    value_en:
      'Comparing two cars on one page shows the real difference — the figure you would actually pay.',
    steps: [
      s('خودروی فعلی', 'Your car', 'مشخصات و وضعیت خودروی فعلی ثبت می‌شود.', 'Current car spec and condition.'),
      s('خودروی هدف', 'Target car', 'خودروی بعدی را از فهرست انتخاب می‌کنید.', 'You pick the next car from the catalogue.'),
      s('مقایسه', 'Compare', 'دو خودرو کنار هم با تفاوت‌های کلیدی نمایش داده می‌شوند.', 'Both cars side by side with the key differences.'),
      s('خلاصه تفاوت', 'The gap', 'تفاوت نمونه ارزش دو خودرو نشان داده می‌شود.', 'The sample value difference is shown.'),
    ],
    faq: [
      f('معاوضه واقعی انجام می‌شود؟', 'Is a real trade-in performed?', 'نه. این یک نمونه محاسباتی است و هیچ معامله‌ای انجام نمی‌شود.', 'No. This is a calculation demo; no transaction takes place.'),
    ],
    tone: 'ink',
    cta_href: '/services/trade-in',
    sort_weight: 5,
  },
  {
    slug: 'installment',
    number: '۰۶',
    title_fa: 'خرید اقساطی (مفهومی)',
    title_en: 'Instalment purchase (concept)',
    kicker_fa: 'پیش‌پرداخت، مدت، و آنچه واقعاً می‌پردازید',
    kicker_en: 'Down payment, term, and the real total',
    intro_fa:
      'این بخش یک ماشین‌حساب مفهومی است، نه یک پیشنهاد اعتباری. هدفش این است که ساختار پرداخت را شفاف نشان دهد.',
    intro_en:
      'This is a concept calculator, not a credit offer. Its purpose is to make the payment structure transparent.',
    problem_fa:
      'در بیشتر گفتگوها فقط «قسط ماهانه» گفته می‌شود؛ در حالی که مجموع پرداختی و پیش‌پرداخت است که تصمیم را تغییر می‌دهد.',
    problem_en:
      'Most conversations quote only the monthly instalment, while the total outlay and down payment are what change the decision.',
    value_fa:
      'با تغییر پیش‌پرداخت و مدت، سه عدد کنار هم دیده می‌شود: پیش‌پرداخت، قسط و مجموع. هیچ نرخ بهره واقعی یا تأیید اعتباری در کار نیست.',
    value_en:
      'Changing down payment and term shows three figures together: down payment, instalment and total. No real interest rate or credit approval is involved.',
    steps: [
      s('قیمت نمونه', 'Sample price', 'قیمت خودرو را از فهرست نمونه انتخاب می‌کنید.', 'Pick a sample price from the demo catalogue.'),
      s('پیش‌پرداخت', 'Down payment', 'درصد پیش‌پرداخت را جابه‌جا می‌کنید.', 'Move the down payment percentage.'),
      s('مدت', 'Term', 'مدت بازپرداخت را انتخاب می‌کنید.', 'Choose the repayment term.'),
      s('جمع‌بندی', 'Summary', 'مجموع پرداختی و تفاوت آن با پرداخت نقدی نمایش داده می‌شود.', 'Total paid, and how it compares with paying cash.'),
    ],
    faq: [
      f('این عددها نرخ واقعی دارد؟', 'Do these numbers use a real rate?', 'نه. هیچ نرخ بهره، اعتبار یا تأییدیه‌ای در این نسخه وجود ندارد؛ اعداد فقط ساختار محاسبه را نشان می‌دهند.', 'No. There is no interest rate, credit line or approval in this version; the numbers only demonstrate the structure.'),
      f('می‌توانم از این برای تصمیم واقعی استفاده کنم؟', 'Can I use this for a real decision?', 'به عنوان الگوی محاسبه بله، به عنوان پیشنهاد مالی خیر.', 'As a calculation pattern, yes. As a financial offer, no.'),
    ],
    tone: 'ivory',
    cta_href: '/services/installment',
    sort_weight: 6,
  },
  {
    slug: 'finder',
    number: '۰۷',
    title_fa: 'خودرویاب شخصی',
    title_en: 'Personal vehicle finder',
    kicker_fa: 'وقتی خودتان نمی‌دانید کدام مدل',
    kicker_en: 'When you do not know the model yet',
    intro_fa:
      'بیشتر آدم‌ها با «چه چیزی می‌خواهم» شروع نمی‌کنند؛ با «چقدر می‌توانم بدهم» شروع می‌کنند. خودرویاب از همین‌جا کار می‌کند.',
    intro_en:
      'Most people do not start with “what do I want” but with “what can I spend”. The finder starts there.',
    problem_fa:
      'در فهرست‌های بزرگ، فیلتر کردن زمانی سخت می‌شود که هنوز اولویت‌ها روشن نیست.',
    problem_en:
      'In a large catalogue, filtering gets hard before your priorities are clear.',
    value_fa:
      'به جای فیلترهای پیچیده، سه چهار سؤال ساده پرسیده می‌شود و نتیجه بر همان اساس رتبه‌بندی می‌شود.',
    value_en:
      'Instead of complex filters, three or four simple questions rank the catalogue accordingly.',
    steps: [
      s('بودجه', 'Budget', 'بازه قیمتی نمونه را انتخاب می‌کنید.', 'Choose a sample price band.'),
      s('کاربری', 'Usage', 'شهر، جاده یا ترکیبی؛ همان چیزی که مصرف و راحتی را تعیین می‌کند.', 'City, highway or mixed — what decides comfort and consumption.'),
      s('اولویت', 'Priority', 'فضا، اقتصاد یا تجهیزات؛ یکی را به عنوان مهم‌ترین انتخاب می‌کنید.', 'Space, economy or equipment — pick the one that matters most.'),
      s('پیشنهاد', 'Result', 'سه گزینه با دلیل نمایش داده می‌شود.', 'Three options with a stated reason each.'),
    ],
    faq: [
      f('پیشنهادها تعهدی دارد؟', 'Do the suggestions commit me?', 'نه. پیشنهادها بر اساس داده نمونه همین فهرست ساخته می‌شوند.', 'No. Suggestions are computed from this demo catalogue only.'),
    ],
    tone: 'steel',
    cta_href: '/services/finder',
    sort_weight: 7,
  },
  {
    slug: 'visit',
    number: '۰۸',
    title_fa: 'بازدید و قرار حضوری',
    title_en: 'Viewing and appointments',
    kicker_fa: 'نیم ساعت، به‌جای دو ساعت گشتن',
    kicker_en: 'Half an hour instead of two hours',
    intro_fa:
      'بازدید حضوری وقتی مفید است که بدانید دقیقاً چه چیزی را باید بررسی کنید و چه سؤالی بپرسید.',
    intro_en:
      'An in-person viewing is useful when you know exactly what to check and what to ask.',
    problem_fa:
      'بدون فهرست، بازدید به یک دور زدن دور خودرو تبدیل می‌شود و تصمیم به احساس لحظه‌ای واگذار می‌شود.',
    problem_en:
      'Without a checklist, a viewing turns into a lap around the car and the decision goes to the moment.',
    value_fa:
      'از هر خودرو یک برگه بازدید کوتاه ساخته می‌شود: موارد حتماً بررسی، سؤالات فروشنده و نکات ثبت تصویری.',
    value_en:
      'Each vehicle gets a short viewing sheet: must-check items, questions for the seller and what to photograph.',
    steps: [
      s('انتخاب خودرو', 'Choose the car', 'از صفحه خودرو، درخواست بازدید نمونه را انتخاب می‌کنید.', 'From a vehicle page, open the demo viewing request.'),
      s('زمان پیشنهادی', 'Suggested slot', 'سه بازه زمانی نمونه انتخاب می‌شود.', 'Three sample time slots.'),
      s('برگه بازدید', 'Viewing sheet', 'فهرست بررسی برای همان خودرو آماده می‌شود.', 'A checklist tailored to that vehicle.'),
      s('ثبت نتیجه', 'Record outcome', 'یادداشت‌ها در همان مرورگر نگه داشته می‌شود.', 'Notes stay in your browser.'),
    ],
    faq: [
      f('قرار واقعی ثبت می‌شود؟', 'Is a real appointment booked?', 'نه. در این نمونه هیچ قرار یا پیامی ثبت و ارسال نمی‌شود.', 'No. No appointment or message is created or sent in this demo.'),
    ],
    tone: 'bronze',
    cta_href: '/contact',
    sort_weight: 8,
  },
  {
    slug: 'consultation',
    number: '۰۹',
    title_fa: 'مشاوره خودرو',
    title_en: 'Automotive consultation',
    kicker_fa: 'یک گفتگو، پیش از یک تصمیم گران',
    kicker_en: 'A conversation before an expensive decision',
    intro_fa:
      'گاهی سؤال اصلی «کدام خودرو» نیست؛ «آیا اصلاً باید عوض کنم» است. مشاوره برای همین مرحله است.',
    intro_en:
      'Sometimes the real question is not which car, but whether to change at all. Consultation is for that stage.',
    problem_fa:
      'تصمیم‌های خودرویی معمولاً زیر فشار زمان گرفته می‌شوند: بیمه تمام می‌شود، خودرو مشکل پیدا می‌کند، یا یک پیشنهاد خوب یک‌هفته‌ای می‌آید.',
    problem_en:
      'Car decisions usually happen under time pressure: insurance expires, a car breaks, or a good offer lasts a week.',
    value_fa:
      'یک چارچوب تصمیم‌گیری ساده در اختیار شما قرار می‌گیرد که می‌توانید بدون عجله روی کاغذ امتحانش کنید.',
    value_en:
      'You get a simple decision framework you can test on paper before anything is rushed.',
    steps: [
      s('وضعیت فعلی', 'Current state', 'خودروی فعلی، کارکرد و هزینه‌هایش ثبت می‌شود.', 'Current car, mileage and its costs.'),
      s('هدف', 'Objective', 'اینکه تغییر برای چه چیزی است: فضا، اقتصاد، یا آرامش.', 'What the change is for: space, economy or peace of mind.'),
      s('گزینه‌ها', 'Options', 'سه مسیر کنار هم: نگه‌داشتن، تعویض، یا صبر کردن.', 'Three paths: keep, change, or wait.'),
      s('تصمیم', 'Decision', 'معیارهای تصمیم نوشته می‌شود تا بعداً قابل بازبینی باشد.', 'Decision criteria are written down so they can be reviewed later.'),
    ],
    faq: [
      f('مشاوره اجرایی است؟', 'Is this an operational service?', 'نه. این یک نمونه تجربه مشاوره است و هیچ خدمت واقعی ارائه نمی‌شود.', 'No. This is a demo of the consultation experience; no real service is delivered.'),
    ],
    tone: 'ivory',
    cta_href: '/contact',
    sort_weight: 9,
  },
  {
    slug: 'guides',
    number: '۱۰',
    title_fa: 'راهنمای مقایسه و خرید',
    title_en: 'Comparison and buying guides',
    kicker_fa: 'دانستن، پیش از پرداختن',
    kicker_en: 'Knowing, before paying',
    intro_fa:
      'راهنماها برای پاسخ به سؤال‌هایی نوشته می‌شوند که در جدول مشخصات پیدا نمی‌شوند: هزینه نگهداری، ارزش دست‌دوم و تجربه روزمره.',
    intro_en:
      'Guides answer the questions a spec sheet cannot: running costs, resale value and daily experience.',
    problem_fa:
      'جدول مشخصات می‌گوید چند اسب بخار دارد؛ نمی‌گوید در ترافیک تهران با چه حالی رانندگی می‌کنید.',
    problem_en:
      'A spec sheet says how many horsepower; it does not say how the car feels in city traffic.',
    value_fa:
      'هر راهنما یک موضوع را باز می‌کند و به یک تصمیم مشخص می‌رسد؛ بدون عدد ساختگی و بدون وعده.',
    value_en:
      'Each guide opens one topic and lands on one concrete decision — no invented figures, no promises.',
    steps: [
      s('موضوع', 'Topic', 'راهنماها بر اساس دسته‌بندی مرتب شده‌اند.', 'Guides are organised by category.'),
      s('مقایسه', 'Comparison', 'در متن به مقایسه واقعی همان فهرست ارجاع داده می‌شود.', 'The text links to real comparisons from this catalogue.'),
      s('جمع‌بندی', 'Conclusion', 'هر راهنما با یک توصیه عملی تمام می‌شود.', 'Every guide ends with one practical recommendation.'),
    ],
    faq: [
      f('منابع چیست؟', 'What are the sources?', 'محتوای مجله نمونه و آموزشی است و به عنوان خبر یا قیمت روز ارائه نمی‌شود.', 'The journal is sample educational content, not news or live pricing.'),
    ],
    tone: 'steel',
    cta_href: '/journal',
    sort_weight: 10,
  },
];
