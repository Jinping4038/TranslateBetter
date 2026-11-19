const exercises = [
{"zh":"虽然这个工作很有挑战性，但我从中学到了很多东西。","en":"Although this job is challenging, I have learned a lot from it.","gentleHint":"Vocabulary: challenging, gain","hint":"Use one contrast connector: “although” at the start or “but” between the clauses, not both for the same pair."},
{"zh":"只要你每天坚持练习，你的英语就会逐渐进步。","en":"As long as you keep practicing every day, your English will gradually improve.","gentleHint":"Vocabulary: consistent, gradually","hint":"“As long as” introduces the condition; use the simple present in that clause and a future form for the result."},
{"zh":"与其担心犯错，不如把它当作学习的机会。","en":"Instead of worrying about making mistakes, see them as opportunities to learn.","gentleHint":"Vocabulary: mistakes, opportunities","hint":"“Instead of” takes an -ing form; “see them as” can introduce an alternative viewpoint."},
{"zh":"这本书让我对不同的文化有了更深入的了解。","en":"This book has given me a deeper understanding of different cultures.","gentleHint":"Vocabulary: understanding, cultures","hint":"“Give someone a … of …” can express the effect; a comparative adjective can indicate greater depth."},
{"zh":"我原以为这很困难，结果比想象中容易。","en":"I thought it would be difficult, but it turned out to be easier than I expected.","gentleHint":"Vocabulary: expect, difficult","hint":"“Turned out to be” introduces the actual result; a clause after “than” can refer back to the original assumption."}
];
const additionalExercises = [
  {
    "zh": "我通常在上班的路上听英语播客。",
    "en": "I usually listen to English podcasts on my way to work.",
    "gentleHint": "Vocabulary: podcasts, commute",
    "hint": "Use the simple present for the habit; “on my way to” can introduce where it happens."
  },
  {
    "zh": "今天早上我差点错过了公交车。",
    "en": "I almost missed the bus this morning.",
    "gentleHint": "Vocabulary: almost, miss",
    "hint": "Put the limiting adverb before the main action; use a past-tense verb for the completed occasion."
  },
  {
    "zh": "你能告诉我最近的地铁站在哪里吗？",
    "en": "Could you tell me where the nearest subway station is?",
    "gentleHint": "Vocabulary: nearest, subway",
    "hint": "After “Could you tell me”, the embedded question uses statement order: question word, subject, then verb."
  },
  {
    "zh": "由于下雨，我们决定把野餐推迟到下周。",
    "en": "Because of the rain, we decided to postpone the picnic until next week.",
    "gentleHint": "Vocabulary: postpone, picnic",
    "hint": "“Because of” takes a noun phrase; “until” can introduce the new date after the main action."
  },
  {
    "zh": "我已经很久没有和大学朋友见面了。",
    "en": "I haven't seen my college friends in a long time.",
    "gentleHint": "Vocabulary: college friends, ages",
    "hint": "Use the present perfect negative for a continuing absence; “in + duration” can describe the interval up to now."
  },
  {
    "zh": "如果明天天气好，我们就去爬山。",
    "en": "If the weather is good tomorrow, we'll go hiking.",
    "gentleHint": "Vocabulary: hiking",
    "hint": "In a future conditional, use the present tense after “if” and a future form in the result clause."
  },
  {
    "zh": "请在离开之前把所有的灯关掉。",
    "en": "Please turn off all the lights before you leave.",
    "gentleHint": "Vocabulary: switch off",
    "hint": "Use an imperative for the instruction; “before” can take a clause or an -ing form to order the actions."
  },
  {
    "zh": "我正在找一家安静又不太贵的咖啡馆。",
    "en": "I'm looking for a quiet café that isn't too expensive.",
    "gentleHint": "Vocabulary: affordable, quiet",
    "hint": "Two descriptions can modify the same noun; a relative clause beginning with “that” can add a requirement."
  },
  {
    "zh": "这家餐厅的食物没有我想象的那么好。",
    "en": "The food at this restaurant isn't as good as I expected.",
    "gentleHint": "Vocabulary: expectations, restaurant",
    "hint": "Use “not as … as” for the unequal comparison; the second “as” can introduce a past-tense clause."
  },
  {
    "zh": "我们最好提前订票，以免到时候没有座位。",
    "en": "We'd better book tickets in advance in case there are no seats left.",
    "gentleHint": "Vocabulary: in advance, seats",
    "hint": "“Had better” takes a base verb; “in case” introduces the possible problem the advice anticipates."
  },
  {
    "zh": "我花了半个小时才找到丢失的钥匙。",
    "en": "It took me half an hour to find my lost keys.",
    "gentleHint": "Vocabulary: half an hour",
    "hint": "“It took + person + duration + to + verb” expresses the time required for a task."
  },
  {
    "zh": "她一到家就开始准备晚饭。",
    "en": "She started preparing dinner as soon as she got home.",
    "gentleHint": "Vocabulary: prepare",
    "hint": "“As soon as” links closely timed actions; use past-tense verbs for both events here."
  },
  {
    "zh": "我以前不喜欢跑步，但现在每周跑三次。",
    "en": "I didn't use to like running, but now I run three times a week.",
    "gentleHint": "Vocabulary: running, weekly",
    "hint": "“Didn’t use to” describes the former state; switch to the simple present for the current routine."
  },
  {
    "zh": "你介意把窗户打开一点吗？",
    "en": "Would you mind opening the window a little?",
    "gentleHint": "Vocabulary: slightly",
    "hint": "“Would you mind” takes an -ing form; place the amount of the requested change after the action."
  },
  {
    "zh": "我们应该尽量减少一次性塑料的使用。",
    "en": "We should try to reduce our use of single-use plastic.",
    "gentleHint": "Vocabulary: single-use plastic, reduce",
    "hint": "“Should” takes a base verb; “try to” can express an effort rather than an absolute requirement."
  },
  {
    "zh": "这件外套很适合你，而且价格也合理。",
    "en": "This coat suits you well, and the price is reasonable too.",
    "gentleHint": "Vocabulary: suit, reasonable",
    "hint": "Link the two positive judgments with “and”; “too” can mark the additional point at the end."
  },
  {
    "zh": "我还没有决定周末要做什么。",
    "en": "I haven't decided what to do this weekend yet.",
    "gentleHint": "Vocabulary: decide, weekend",
    "hint": "The present perfect negative fits “yet”; “what to + verb” can name the unresolved activity."
  },
  {
    "zh": "他答应会在星期五之前把报告发给我。",
    "en": "He promised to send me the report by Friday.",
    "gentleHint": "Vocabulary: promise, report",
    "hint": "The first verb can take “to + base verb”; “by Friday” gives a deadline, not an exact occasion."
  },
  {
    "zh": "为了赶上早班飞机，我们必须凌晨四点出发。",
    "en": "We have to leave at four in the morning to catch the early flight.",
    "gentleHint": "Vocabulary: depart, flight",
    "hint": "“Have to” expresses necessity; a separate “to + verb” phrase can explain the purpose."
  },
  {
    "zh": "即使很忙，我也会每天给父母打电话。",
    "en": "Even when I'm busy, I call my parents every day.",
    "gentleHint": "Vocabulary: busy, parents",
    "hint": "“Even when” introduces a situation that does not stop the routine; the simple present fits the recurring action."
  },
  {
    "zh": "我发现早睡能让我第二天更有精神。",
    "en": "I've found that going to bed early gives me more energy the next day.",
    "gentleHint": "Vocabulary: energetic, bedtime",
    "hint": "An -ing phrase can function as a subject; a present-perfect opening can introduce a discovery relevant now."
  },
  {
    "zh": "这条路正在维修，所以我们得绕道走。",
    "en": "This road is being repaired, so we have to take a detour.",
    "gentleHint": "Vocabulary: repair, detour",
    "hint": "Use “is being + past participle” for ongoing work with an unspecified agent; “so” introduces the consequence."
  },
  {
    "zh": "请提醒我下班后去取包裹。",
    "en": "Please remind me to pick up the package after work.",
    "gentleHint": "Vocabulary: parcel, collect",
    "hint": "“Remind + person + to + verb” separates the requested reminder from the later action."
  },
  {
    "zh": "我宁愿在家做饭，也不想出去吃。",
    "en": "I'd rather cook at home than eat out.",
    "gentleHint": "Vocabulary: cook, eat out",
    "hint": "Use “would rather + base verb” and “than + base verb” to express the preference."
  },
  {
    "zh": "她总是能把复杂的问题解释得很清楚。",
    "en": "She can always explain complicated problems clearly.",
    "gentleHint": "Vocabulary: complicated, clearly",
    "hint": "An adjective can describe the object, while an adverb describes how the action is performed."
  },
  {
    "zh": "我们需要更多时间来比较这两个方案。",
    "en": "We need more time to compare these two options.",
    "gentleHint": "Vocabulary: compare, options",
    "hint": "“Need more + uncountable noun” states the requirement; an infinitive can give its purpose."
  },
  {
    "zh": "这个项目比我们预期的花费更高。",
    "en": "This project costs more than we expected.",
    "gentleHint": "Vocabulary: cost, project",
    "hint": "“More than” introduces the comparison; use a past-tense clause for the earlier assumption."
  },
  {
    "zh": "如果你有任何问题，随时联系我。",
    "en": "If you have any questions, feel free to contact me.",
    "gentleHint": "Vocabulary: contact, questions",
    "hint": "“Feel free to + verb” makes a friendly invitation; an “if” clause can state when it applies."
  },
  {
    "zh": "会议结束后，我会整理笔记并发给大家。",
    "en": "After the meeting, I'll organize my notes and send them to everyone.",
    "gentleHint": "Vocabulary: organize, notes",
    "hint": "Keep the two planned verbs parallel after “will”; a pronoun can replace the repeated object in the second action."
  },
  {
    "zh": "他没有直接回答我的问题，而是换了个话题。",
    "en": "He didn't answer my question directly; instead, he changed the subject.",
    "gentleHint": "Vocabulary: directly, subject",
    "hint": "Contrast a negative past clause with a positive one; “instead” can introduce the replacement action."
  },
  {
    "zh": "我很感谢你在我最需要的时候帮助了我。",
    "en": "I'm grateful that you helped me when I needed it most.",
    "gentleHint": "Vocabulary: grateful, support",
    "hint": "A “that” clause can state the cause of an attitude; a “when” clause can identify the important occasion."
  },
  {
    "zh": "学会倾听和表达自己的想法同样重要。",
    "en": "Learning to listen is just as important as expressing your own ideas.",
    "gentleHint": "Vocabulary: express, ideas",
    "hint": "Use “just as … as” for equality; -ing phrases can name the two abilities being compared."
  },
  {
    "zh": "我们不应该根据一个人的外表来评价他。",
    "en": "We shouldn't judge someone by their appearance.",
    "gentleHint": "Vocabulary: judge, appearance",
    "hint": "“Shouldn’t + base verb” gives negative advice; “by” can introduce the basis of an evaluation."
  },
  {
    "zh": "这个决定可能会对我们的生活产生长期影响。",
    "en": "This decision could have a long-term impact on our lives.",
    "gentleHint": "Vocabulary: impact, long-term",
    "hint": "“Could” expresses possibility; the preposition “on” can connect the effect to what is affected."
  },
  {
    "zh": "我越了解这个城市，就越喜欢这里。",
    "en": "The more I learn about this city, the more I like it.",
    "gentleHint": "Vocabulary: get to know, appreciate",
    "hint": "Use the paired pattern “the more …, the more …” for two changes that develop together."
  },
  {
    "zh": "她不仅完成了自己的任务，还帮助了其他同事。",
    "en": "She not only finished her own tasks but also helped her colleagues.",
    "gentleHint": "Vocabulary: colleagues, tasks",
    "hint": "“Not only … but also …” links the contributions; keep the verb phrases parallel."
  },
  {
    "zh": "在做决定之前，我们应该听听不同的意见。",
    "en": "Before making a decision, we should listen to different opinions.",
    "gentleHint": "Vocabulary: opinions, decision",
    "hint": "“Before + -ing” can introduce the first step; remember “to” after “listen”."
  },
  {
    "zh": "我希望将来能有机会在国外生活一段时间。",
    "en": "I hope to have the opportunity to live abroad for a while someday.",
    "gentleHint": "Vocabulary: opportunity, abroad",
    "hint": "“Hope to + verb” introduces the wish; “for a while” can describe a temporary stay."
  },
  {
    "zh": "失败并不意味着你没有能力。",
    "en": "Failure doesn't mean you're incapable.",
    "gentleHint": "Vocabulary: failure, incapable",
    "hint": "Use a present-tense negative main clause; a following clause can state the conclusion being rejected."
  },
  {
    "zh": "重要的不是你学得多快，而是你是否坚持。",
    "en": "What matters is not how fast you learn, but whether you keep going.",
    "gentleHint": "Vocabulary: persist, speed",
    "hint": "“What matters” introduces the main criterion; “not … but whether …” can contrast the two considerations."
  },
  {
    "zh": "我们原计划坐火车，但最后决定开车。",
    "en": "We originally planned to take the train, but decided to drive in the end.",
    "gentleHint": "Vocabulary: originally, drive",
    "hint": "“Planned to” introduces the initial intention; “but” and “in the end” can mark the final choice."
  },
  {
    "zh": "这部电影让我想起了自己的童年。",
    "en": "This movie reminded me of my childhood.",
    "gentleHint": "Vocabulary: childhood, memory",
    "hint": "“Remind + person + of + something” links a trigger to a recollection; use the past tense here."
  },
  {
    "zh": "我已经习惯了在新的城市独自生活。",
    "en": "I've gotten used to living alone in a new city.",
    "gentleHint": "Vocabulary: accustomed, alone",
    "hint": "“Have gotten used to” expresses an adjustment completed by now; “to” here takes a noun or an -ing form."
  },
  {
    "zh": "你不必马上回答，可以先考虑一下。",
    "en": "You don't have to answer right away; you can think about it first.",
    "gentleHint": "Vocabulary: immediately, consider",
    "hint": "“Don’t have to” removes an obligation; it does not prohibit the action."
  },
  {
    "zh": "如果我早点出门，就不会迟到了。",
    "en": "If I had left earlier, I wouldn't have been late.",
    "gentleHint": "Vocabulary: set off, earlier",
    "hint": "Use “if + had + past participle” with “would have + past participle” for an unreal past result."
  },
  {
    "zh": "我刚准备出门，电话就响了。",
    "en": "I was just about to leave when the phone rang.",
    "gentleHint": "Vocabulary: ring, departure",
    "hint": "“Was about to + verb” describes an imminent action; “when” can introduce the interrupting event."
  },
  {
    "zh": "无论结果如何，我都为自己的努力感到骄傲。",
    "en": "Whatever the outcome, I'm proud of the effort I've put in.",
    "gentleHint": "Vocabulary: effort, proud",
    "hint": "“Whatever the outcome” or “no matter how it turns out” can introduce the unconditional opening."
  },
  {
    "zh": "我们需要在工作和休息之间找到平衡。",
    "en": "We need to find a balance between work and rest.",
    "gentleHint": "Vocabulary: balance",
    "hint": "“Between … and …” links the two activities; keep their grammatical forms parallel."
  },
  {
    "zh": "这份工作需要耐心，也需要良好的沟通能力。",
    "en": "This job requires both patience and good communication skills.",
    "gentleHint": "Vocabulary: patience, communication skills",
    "hint": "“Both … and …” joins two required qualities; a simple-present verb can state the requirement."
  },
  {
    "zh": "我没想到一个小小的改变会带来这么大的不同。",
    "en": "I didn't expect such a small change to make such a big difference.",
    "gentleHint": "Vocabulary: difference, expect",
    "hint": "An object followed by “to + verb” can complete the first verb; “such a + adjective + noun” emphasizes the contrast in scale."
  },
  {
    "zh": "他建议我们先做一些调查，再开始这个项目。",
    "en": "He suggested doing some research before starting the project.",
    "gentleHint": "Vocabulary: research, suggest",
    "hint": "An -ing form can follow the reporting verb; “before + -ing” orders the proposed activities."
  },
  {
    "zh": "我正在努力减少花在手机上的时间。",
    "en": "I'm trying to cut down on the time I spend on my phone.",
    "gentleHint": "Vocabulary: cut down on, screen time",
    "hint": "The present continuous fits the current effort; a relative clause can identify how the relevant duration is spent."
  },
  {
    "zh": "与网上购物相比，我更喜欢去实体店。",
    "en": "I prefer shopping in physical stores to shopping online.",
    "gentleHint": "Vocabulary: physical stores, prefer",
    "hint": "Use matching -ing phrases for the two alternatives, joined by “to” rather than “than”."
  },
  {
    "zh": "这个应用让我更容易记录每天的开支。",
    "en": "This app makes it easier for me to track my daily expenses.",
    "gentleHint": "Vocabulary: expenses, track",
    "hint": "“Make it easier for + person + to + verb” expresses how something helps with a task."
  },
  {
    "zh": "我忘记带充电器了，手机快没电了。",
    "en": "I forgot to bring my charger, and my phone is running out of battery.",
    "gentleHint": "Vocabulary: charger, battery",
    "hint": "Use the simple past for the completed action; “is running out of” describes the current developing situation."
  },
  {
    "zh": "你能帮我检查一下这封邮件有没有语法错误吗？",
    "en": "Could you help me check this email for grammatical errors?",
    "gentleHint": "Vocabulary: check, grammatical",
    "hint": "“Could you help me + base verb” makes a polite request; “for” can introduce the kind of problem being sought."
  },
  {
    "zh": "她说话很轻，所以我几乎听不清。",
    "en": "She spoke so quietly that I could barely hear her.",
    "gentleHint": "Vocabulary: quietly, barely",
    "hint": "“So + adverb + that” links the manner of an action to its result."
  },
  {
    "zh": "我需要一张靠窗的桌子，这样光线会好一些。",
    "en": "I need a table by the window so that I'll have better light.",
    "gentleHint": "Vocabulary: by the window, lighting",
    "hint": "“So that” can introduce the desired benefit of a choice; follow it with a clause."
  },
  {
    "zh": "这双鞋穿起来很舒服，适合长时间走路。",
    "en": "These shoes are comfortable and suitable for long walks.",
    "gentleHint": "Vocabulary: comfortable, suitable",
    "hint": "Join the two descriptions with “and”; “for” can introduce the relevant activity as a noun or an -ing form."
  },
  {
    "zh": "我们到达车站时，火车已经开走了。",
    "en": "By the time we arrived at the station, the train had already left.",
    "gentleHint": "Vocabulary: station, depart",
    "hint": "Use the past perfect for the earlier event; “by the time” can introduce the later one in the simple past."
  },
  {
    "zh": "这次旅行最让我难忘的是当地人的热情。",
    "en": "What I remember most about this trip is the warmth of the local people.",
    "gentleHint": "Vocabulary: warmth, local",
    "hint": "A “What … most” clause can act as the subject; place the emphasized detail after “is”."
  },
  {
    "zh": "我想预订一个可以免费取消的房间。",
    "en": "I'd like to book a room with free cancellation.",
    "gentleHint": "Vocabulary: reserve, cancellation",
    "hint": "Attach the extra condition with “with + noun phrase”; a polite opening such as “I’d like to” can introduce the request."
  },
  {
    "zh": "你知道这张票是否包含行李费用吗？",
    "en": "Do you know whether this ticket includes baggage fees?",
    "gentleHint": "Vocabulary: baggage, fees",
    "hint": "After “Do you know”, use “whether” or “if” and statement word order in the embedded question."
  },
  {
    "zh": "我们迷路了，幸好有人帮我们指路。",
    "en": "We got lost, but luckily someone gave us directions.",
    "gentleHint": "Vocabulary: directions, lost",
    "hint": "Use past-tense clauses for the two events; “but luckily” can mark the favorable turn."
  },
  {
    "zh": "这家博物馆每周一不对外开放。",
    "en": "This museum is closed to the public every Monday.",
    "gentleHint": "Vocabulary: closed, public",
    "hint": "“Be + adjective” describes the state; a recurring-day expression can give the schedule."
  },
  {
    "zh": "我想尝试当地的食物，而不是只去熟悉的餐厅。",
    "en": "I'd like to try local food instead of only going to familiar restaurants.",
    "gentleHint": "Vocabulary: local, familiar",
    "hint": "Use “instead of + -ing” for the alternative being avoided, keeping “only” with that alternative."
  },
  {
    "zh": "请问走到海边大约需要多长时间？",
    "en": "Excuse me, about how long does it take to walk to the beach?",
    "gentleHint": "Vocabulary: beach, approximately",
    "hint": "“How long does it take to + verb?” asks about duration; an opening such as “Excuse me” makes it polite."
  },
  {
    "zh": "我们应该给自己留出足够的转机时间。",
    "en": "We should allow ourselves enough time for the connection.",
    "gentleHint": "Vocabulary: allow, connection",
    "hint": "A reflexive pronoun can refer back to the people arranging things; “enough + uncountable noun” expresses sufficiency."
  },
  {
    "zh": "我把护照放在包里了，但现在找不到。",
    "en": "I put my passport in my bag, but I can't find it now.",
    "gentleHint": "Vocabulary: passport",
    "hint": "Use a past-tense verb for the earlier action and a present-tense negative for the current problem."
  },
  {
    "zh": "虽然旅途很累，但沿途的风景非常值得。",
    "en": "Although the journey was tiring, the scenery along the way made it worthwhile.",
    "gentleHint": "Vocabulary: tiring, worthwhile",
    "hint": "“Although” can introduce the drawback; do not add “but” to connect the same two clauses."
  },
  {
    "zh": "我想学习如何更清楚地表达自己的观点。",
    "en": "I want to learn how to express my opinions more clearly.",
    "gentleHint": "Vocabulary: express, opinions",
    "hint": "“Learn how to + verb” introduces the intended skill; a comparative adverb can describe the desired improvement."
  },
  {
    "zh": "每次遇到生词，我都会先根据上下文猜意思。",
    "en": "Whenever I come across an unfamiliar word, I first try to guess its meaning from the context.",
    "gentleHint": "Vocabulary: unfamiliar, context",
    "hint": "“Whenever” with the simple present fits this recurring situation; “first” marks the initial strategy."
  },
  {
    "zh": "与其死记单词，不如把它们放在句子里练习。",
    "en": "Instead of memorizing words mechanically, practice using them in sentences.",
    "gentleHint": "Vocabulary: mechanically, memorize",
    "hint": "After “instead of”, use an -ing form; an imperative can introduce the recommended alternative."
  },
  {
    "zh": "我能看懂大部分内容，但说起来还不够流利。",
    "en": "I can understand most of the content, but I'm still not very fluent when I speak.",
    "gentleHint": "Vocabulary: fluent, content",
    "hint": "Link the ability and its limitation with “but”; a “when” clause can specify the situation where the limitation applies."
  },
  {
    "zh": "你能说慢一点，让我记下来吗？",
    "en": "Could you speak a little more slowly so I can write it down?",
    "gentleHint": "Vocabulary: slowly, note down",
    "hint": "A “Could you …?” request can be followed by “so I can …” to give its purpose."
  },
  {
    "zh": "这个词在正式和非正式场合的用法不同。",
    "en": "This word is used differently in formal and informal situations.",
    "gentleHint": "Vocabulary: formal, informal",
    "hint": "Use a passive clause to focus on usage; an adverb can describe the difference across contexts."
  },
  {
    "zh": "我最近开始用英语写日记。",
    "en": "I've recently started keeping a diary in English.",
    "gentleHint": "Vocabulary: diary, recently",
    "hint": "The present perfect connects the beginning to now; an -ing form can follow “start”."
  },
  {
    "zh": "如果只看答案而不自己练习，就很难真正进步。",
    "en": "It's hard to make real progress if you only look at the answers without practicing yourself.",
    "gentleHint": "Vocabulary: progress, independently",
    "hint": "An “if” clause can state the condition; “without + -ing” expresses the missing activity."
  },
  {
    "zh": "我想先自己试一下，然后再看参考答案。",
    "en": "I'd like to try it myself first and then look at the reference answer.",
    "gentleHint": "Vocabulary: attempt, reference answer",
    "hint": "“First” and “then” order the actions; a reflexive pronoun emphasizes the independent effort."
  },
  {
    "zh": "你能举个例子说明这两个词的区别吗？",
    "en": "Could you give an example to explain the difference between these two words?",
    "gentleHint": "Vocabulary: distinction, example",
    "hint": "A polite “Could you …?” question can include an infinitive of purpose; “between” can introduce the pair being discussed."
  },
  {
    "zh": "我答应自己每天至少练习十分钟。",
    "en": "I promised myself I would practice for at least ten minutes every day.",
    "gentleHint": "Vocabulary: promise, at least",
    "hint": "For a past commitment, “would + base verb” can express the future action; “for” introduces its duration."
  },
  {
    "zh": "我们应该把大目标分成几个容易完成的小任务。",
    "en": "We should break big goals down into smaller, manageable tasks.",
    "gentleHint": "Vocabulary: manageable, divide",
    "hint": "“Break … down into …” links a whole to its parts; an adjective can describe the resulting pieces."
  },
  {
    "zh": "我发现把通知关掉以后更容易集中注意力。",
    "en": "I've found it easier to concentrate after turning off notifications.",
    "gentleHint": "Vocabulary: notifications, concentrate",
    "hint": "“Find it easier to + verb” expresses the helpful change; “after + -ing” identifies what preceded it."
  },
  {
    "zh": "不要因为一天没有进步就放弃整个计划。",
    "en": "Don't give up on the whole plan just because you haven't made progress for one day.",
    "gentleHint": "Vocabulary: give up, progress",
    "hint": "Use “Don’t + base verb” for the advice; “just because” can introduce the insufficient reason."
  },
  {
    "zh": "她用了几个月的时间养成了每天阅读的习惯。",
    "en": "It took her a few months to develop the habit of reading every day.",
    "gentleHint": "Vocabulary: habit, develop",
    "hint": "The pattern “It took + person + duration + to + verb” measures an interval; “of + -ing” can specify a recurring activity."
  },
  {
    "zh": "我希望下个月能比现在更有信心。",
    "en": "I hope I'll feel more confident next month than I do now.",
    "gentleHint": "Vocabulary: confident",
    "hint": "Use a comparative adjective followed by “than”; the second clause can refer back to the present feeling."
  },
  {
    "zh": "只要方法合适，短时间的练习也能有效果。",
    "en": "As long as you use the right approach, even short practice sessions can be effective.",
    "gentleHint": "Vocabulary: effective, approach",
    "hint": "“As long as” introduces the condition; “even” can emphasize that the limited amount is still relevant."
  },
  {
    "zh": "休息并不是浪费时间，而是为了更好地继续。",
    "en": "Resting isn't a waste of time; it helps you carry on more effectively.",
    "gentleHint": "Vocabulary: waste, continue",
    "hint": "An -ing phrase can name the activity; contrast a negative statement with a positive explanation of its purpose."
  },
  {
    "zh": "我正在学习接受自己不可能事事完美。",
    "en": "I'm learning to accept that I can't be perfect at everything.",
    "gentleHint": "Vocabulary: accept, perfect",
    "hint": "Use the present continuous for an ongoing process; a “that” clause can contain the negative claim."
  },
  {
    "zh": "当任务太多时，我会先列出最重要的三件事。",
    "en": "When I have too many tasks, I start by listing the three most important ones.",
    "gentleHint": "Vocabulary: priorities, list",
    "hint": "A “when” clause can give the trigger; “start by + -ing” introduces the response."
  },
  {
    "zh": "我们不能控制一切，但可以选择如何回应。",
    "en": "We can't control everything, but we can choose how to respond.",
    "gentleHint": "Vocabulary: respond, control",
    "hint": "Contrast “can’t” with “can”; “how to + base verb” can name the remaining choice."
  },
  {
    "zh": "这段经历让我明白了耐心的重要性。",
    "en": "This experience taught me the importance of patience.",
    "gentleHint": "Vocabulary: patience, importance",
    "hint": "“Teach + person + noun phrase” can express the effect of an experience; “of” introduces the lesson’s topic."
  },
  {
    "zh": "如果有机会重新开始，我还是会做同样的选择。",
    "en": "If I had the chance to start over, I would make the same choice.",
    "gentleHint": "Vocabulary: chance, restart",
    "hint": "Use “if + past tense” with “would + base verb” for an imagined possibility."
  },
  {
    "zh": "有时候，问一个好问题比立刻给出答案更有帮助。",
    "en": "Sometimes asking a good question is more helpful than giving an immediate answer.",
    "gentleHint": "Vocabulary: helpful, immediate",
    "hint": "Compare two -ing phrases using “more + adjective + than”."
  },
  {
    "zh": "我还在学习，但我已经比昨天更进一步了。",
    "en": "I'm still learning, but I've already taken another step forward since yesterday.",
    "gentleHint": "Vocabulary: step forward",
    "hint": "Contrast an ongoing activity with a present-perfect achievement; “since” introduces the starting point."
  }
];

export default [...exercises, ...additionalExercises];
