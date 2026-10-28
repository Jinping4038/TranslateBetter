const exercises = [
{zh:'虽然这个工作很有挑战性，但我从中学到了很多东西。',en:'Although this job is challenging, I have learned a lot from it.',hint:'Use “Although” to connect the challenge with what you learned. You don’t need “but” in the same sentence.'},
{zh:'只要你每天坚持练习，你的英语就会逐渐进步。',en:'As long as you keep practicing every day, your English will gradually improve.',hint:'“As long as” introduces a condition. Try “gradually improve” for 逐渐进步.'},
{zh:'与其担心犯错，不如把它当作学习的机会。',en:'Instead of worrying about making mistakes, see them as opportunities to learn.',hint:'Start with “Instead of” followed by a verb ending in -ing.'},
{zh:'这本书让我对不同的文化有了更深入的了解。',en:'This book has given me a deeper understanding of different cultures.',hint:'Try “a deeper understanding of” for 更深入的了解.'},
{zh:'我原以为这很困难，结果比想象中容易。',en:'I thought it would be difficult, but it turned out to be easier than I expected.',hint:'“It turned out to be” works well for 结果.'}
];
const additionalExercises = [
  {
    "zh": "我通常在上班的路上听英语播客。",
    "en": "I usually listen to English podcasts on my way to work.",
    "hint": "Use “on my way to” for 在……的路上."
  },
  {
    "zh": "今天早上我差点错过了公交车。",
    "en": "I almost missed the bus this morning.",
    "hint": "“Almost” goes before the main verb."
  },
  {
    "zh": "你能告诉我最近的地铁站在哪里吗？",
    "en": "Could you tell me where the nearest subway station is?",
    "hint": "Use statement word order after “Could you tell me”."
  },
  {
    "zh": "由于下雨，我们决定把野餐推迟到下周。",
    "en": "Because of the rain, we decided to postpone the picnic until next week.",
    "hint": "“Because of” is followed by a noun phrase."
  },
  {
    "zh": "我已经很久没有和大学朋友见面了。",
    "en": "I haven't seen my college friends in a long time.",
    "hint": "Use the present perfect with “in a long time”."
  },
  {
    "zh": "如果明天天气好，我们就去爬山。",
    "en": "If the weather is good tomorrow, we'll go hiking.",
    "hint": "Use the present tense in the “if” clause."
  },
  {
    "zh": "请在离开之前把所有的灯关掉。",
    "en": "Please turn off all the lights before you leave.",
    "hint": "Try the phrasal verb “turn off”."
  },
  {
    "zh": "我正在找一家安静又不太贵的咖啡馆。",
    "en": "I'm looking for a quiet café that isn't too expensive.",
    "hint": "“Look for” means try to find something."
  },
  {
    "zh": "这家餐厅的食物没有我想象的那么好。",
    "en": "The food at this restaurant isn't as good as I expected.",
    "hint": "Use “not as … as” for 没有……那么……."
  },
  {
    "zh": "我们最好提前订票，以免到时候没有座位。",
    "en": "We'd better book tickets in advance in case there are no seats left.",
    "hint": "“Had better” is followed by the base form of a verb."
  },
  {
    "zh": "我花了半个小时才找到丢失的钥匙。",
    "en": "It took me half an hour to find my lost keys.",
    "hint": "Use “It took someone … to do something”."
  },
  {
    "zh": "她一到家就开始准备晚饭。",
    "en": "She started preparing dinner as soon as she got home.",
    "hint": "“As soon as” connects two closely timed events."
  },
  {
    "zh": "我以前不喜欢跑步，但现在每周跑三次。",
    "en": "I didn't use to like running, but now I run three times a week.",
    "hint": "Use “didn't use to” for a past habit or state."
  },
  {
    "zh": "你介意把窗户打开一点吗？",
    "en": "Would you mind opening the window a little?",
    "hint": "“Would you mind” is followed by an -ing form."
  },
  {
    "zh": "我们应该尽量减少一次性塑料的使用。",
    "en": "We should try to reduce our use of single-use plastic.",
    "hint": "Use “reduce our use of” for 减少……的使用."
  },
  {
    "zh": "这件外套很适合你，而且价格也合理。",
    "en": "This coat suits you well, and the price is reasonable too.",
    "hint": "“Suit” can describe how clothing looks on someone."
  },
  {
    "zh": "我还没有决定周末要做什么。",
    "en": "I haven't decided what to do this weekend yet.",
    "hint": "Try “what to do” after “decided”."
  },
  {
    "zh": "他答应会在星期五之前把报告发给我。",
    "en": "He promised to send me the report by Friday.",
    "hint": "“By Friday” means no later than Friday."
  },
  {
    "zh": "为了赶上早班飞机，我们必须凌晨四点出发。",
    "en": "We have to leave at four in the morning to catch the early flight.",
    "hint": "Use an infinitive to express the purpose of leaving."
  },
  {
    "zh": "即使很忙，我也会每天给父母打电话。",
    "en": "Even when I'm busy, I call my parents every day.",
    "hint": "“Even when” emphasizes that the habit continues."
  },
  {
    "zh": "我发现早睡能让我第二天更有精神。",
    "en": "I've found that going to bed early gives me more energy the next day.",
    "hint": "An -ing phrase can be the subject of a clause."
  },
  {
    "zh": "这条路正在维修，所以我们得绕道走。",
    "en": "This road is being repaired, so we have to take a detour.",
    "hint": "Use the present continuous passive for work happening now."
  },
  {
    "zh": "请提醒我下班后去取包裹。",
    "en": "Please remind me to pick up the package after work.",
    "hint": "Use “remind someone to do something”."
  },
  {
    "zh": "我宁愿在家做饭，也不想出去吃。",
    "en": "I'd rather cook at home than eat out.",
    "hint": "Use “would rather … than …” with base verb forms."
  },
  {
    "zh": "她总是能把复杂的问题解释得很清楚。",
    "en": "She can always explain complicated problems clearly.",
    "hint": "Place “clearly” after what is being explained."
  },
  {
    "zh": "我们需要更多时间来比较这两个方案。",
    "en": "We need more time to compare these two options.",
    "hint": "“Compare” takes the options being considered as its object."
  },
  {
    "zh": "这个项目比我们预期的花费更高。",
    "en": "This project costs more than we expected.",
    "hint": "Use “more than” to compare the actual cost with expectations."
  },
  {
    "zh": "如果你有任何问题，随时联系我。",
    "en": "If you have any questions, feel free to contact me.",
    "hint": "“Feel free to” is a friendly invitation."
  },
  {
    "zh": "会议结束后，我会整理笔记并发给大家。",
    "en": "After the meeting, I'll organize my notes and send them to everyone.",
    "hint": "Keep the two planned actions parallel after “I'll”."
  },
  {
    "zh": "他没有直接回答我的问题，而是换了个话题。",
    "en": "He didn't answer my question directly; instead, he changed the subject.",
    "hint": "“Change the subject” means switch the topic of conversation."
  },
  {
    "zh": "我很感谢你在我最需要的时候帮助了我。",
    "en": "I'm grateful that you helped me when I needed it most.",
    "hint": "“Be grateful” expresses appreciation."
  },
  {
    "zh": "学会倾听和表达自己的想法同样重要。",
    "en": "Learning to listen is just as important as expressing your own ideas.",
    "hint": "Use “just as … as” to show equal importance."
  },
  {
    "zh": "我们不应该根据一个人的外表来评价他。",
    "en": "We shouldn't judge someone by their appearance.",
    "hint": "Use “judge someone by” for the basis of a judgment."
  },
  {
    "zh": "这个决定可能会对我们的生活产生长期影响。",
    "en": "This decision could have a long-term impact on our lives.",
    "hint": "Try “have an impact on”."
  },
  {
    "zh": "我越了解这个城市，就越喜欢这里。",
    "en": "The more I learn about this city, the more I like it.",
    "hint": "Use the paired pattern “The more …, the more …”."
  },
  {
    "zh": "她不仅完成了自己的任务，还帮助了其他同事。",
    "en": "She not only finished her own tasks but also helped her colleagues.",
    "hint": "Keep the verb phrases after “not only” and “but also” parallel."
  },
  {
    "zh": "在做决定之前，我们应该听听不同的意见。",
    "en": "Before making a decision, we should listen to different opinions.",
    "hint": "Use an -ing form after “before” when omitting the subject."
  },
  {
    "zh": "我希望将来能有机会在国外生活一段时间。",
    "en": "I hope to have the opportunity to live abroad for a while someday.",
    "hint": "“For a while” expresses an unspecified period of time."
  },
  {
    "zh": "失败并不意味着你没有能力。",
    "en": "Failure doesn't mean you're incapable.",
    "hint": "Use “doesn't mean” to challenge an assumption."
  },
  {
    "zh": "重要的不是你学得多快，而是你是否坚持。",
    "en": "What matters is not how fast you learn, but whether you keep going.",
    "hint": "“What matters” can act as the subject."
  },
  {
    "zh": "我们原计划坐火车，但最后决定开车。",
    "en": "We originally planned to take the train, but decided to drive in the end.",
    "hint": "“In the end” introduces the final outcome."
  },
  {
    "zh": "这部电影让我想起了自己的童年。",
    "en": "This movie reminded me of my childhood.",
    "hint": "Use “remind someone of something”."
  },
  {
    "zh": "我已经习惯了在新的城市独自生活。",
    "en": "I've gotten used to living alone in a new city.",
    "hint": "“Get used to” is followed by a noun or -ing form."
  },
  {
    "zh": "你不必马上回答，可以先考虑一下。",
    "en": "You don't have to answer right away; you can think about it first.",
    "hint": "“Don't have to” expresses a lack of obligation."
  },
  {
    "zh": "如果我早点出门，就不会迟到了。",
    "en": "If I had left earlier, I wouldn't have been late.",
    "hint": "Use the third conditional for an unreal past situation."
  },
  {
    "zh": "我刚准备出门，电话就响了。",
    "en": "I was just about to leave when the phone rang.",
    "hint": "“Be about to … when …” describes an interrupted action."
  },
  {
    "zh": "无论结果如何，我都为自己的努力感到骄傲。",
    "en": "Whatever the outcome, I'm proud of the effort I've put in.",
    "hint": "“Whatever the outcome” means regardless of the result."
  },
  {
    "zh": "我们需要在工作和休息之间找到平衡。",
    "en": "We need to find a balance between work and rest.",
    "hint": "Use “a balance between … and …”."
  },
  {
    "zh": "这份工作需要耐心，也需要良好的沟通能力。",
    "en": "This job requires both patience and good communication skills.",
    "hint": "Use “both … and …” to join two requirements."
  },
  {
    "zh": "我没想到一个小小的改变会带来这么大的不同。",
    "en": "I didn't expect such a small change to make such a big difference.",
    "hint": "“Make a difference” describes having an effect."
  },
  {
    "zh": "他建议我们先做一些调查，再开始这个项目。",
    "en": "He suggested doing some research before starting the project.",
    "hint": "Use “suggest doing”, not “suggest to do”."
  },
  {
    "zh": "我正在努力减少花在手机上的时间。",
    "en": "I'm trying to cut down on the time I spend on my phone.",
    "hint": "“Cut down on” means reduce."
  },
  {
    "zh": "与网上购物相比，我更喜欢去实体店。",
    "en": "I prefer shopping in physical stores to shopping online.",
    "hint": "Use “prefer … to …” with matching -ing forms."
  },
  {
    "zh": "这个应用让我更容易记录每天的开支。",
    "en": "This app makes it easier for me to track my daily expenses.",
    "hint": "Try “make it easier for someone to”."
  },
  {
    "zh": "我忘记带充电器了，手机快没电了。",
    "en": "I forgot to bring my charger, and my phone is running out of battery.",
    "hint": "“Run out of” describes a supply becoming exhausted."
  },
  {
    "zh": "你能帮我检查一下这封邮件有没有语法错误吗？",
    "en": "Could you help me check this email for grammatical errors?",
    "hint": "Use “check something for errors”."
  },
  {
    "zh": "她说话很轻，所以我几乎听不清。",
    "en": "She spoke so quietly that I could barely hear her.",
    "hint": "Use “so … that …” to express a result."
  },
  {
    "zh": "我需要一张靠窗的桌子，这样光线会好一些。",
    "en": "I need a table by the window so that I'll have better light.",
    "hint": "“So that” introduces the purpose of a choice."
  },
  {
    "zh": "这双鞋穿起来很舒服，适合长时间走路。",
    "en": "These shoes are comfortable and suitable for long walks.",
    "hint": "“Suitable for” is followed by a noun or -ing form."
  },
  {
    "zh": "我们到达车站时，火车已经开走了。",
    "en": "By the time we arrived at the station, the train had already left.",
    "hint": "Use the past perfect for the earlier of two past events."
  },
  {
    "zh": "这次旅行最让我难忘的是当地人的热情。",
    "en": "What I remember most about this trip is the warmth of the local people.",
    "hint": "Start with a “What” clause to emphasize the memorable part."
  },
  {
    "zh": "我想预订一个可以免费取消的房间。",
    "en": "I'd like to book a room with free cancellation.",
    "hint": "“I'd like to” is a polite way to state a request."
  },
  {
    "zh": "你知道这张票是否包含行李费用吗？",
    "en": "Do you know whether this ticket includes baggage fees?",
    "hint": "Keep statement word order in the embedded question."
  },
  {
    "zh": "我们迷路了，幸好有人帮我们指路。",
    "en": "We got lost, but luckily someone gave us directions.",
    "hint": "“Give someone directions” means explain how to get somewhere."
  },
  {
    "zh": "这家博物馆每周一不对外开放。",
    "en": "This museum is closed to the public every Monday.",
    "hint": "“Closed to the public” means visitors cannot enter."
  },
  {
    "zh": "我想尝试当地的食物，而不是只去熟悉的餐厅。",
    "en": "I'd like to try local food instead of only going to familiar restaurants.",
    "hint": "Use “instead of” followed by an -ing phrase."
  },
  {
    "zh": "请问走到海边大约需要多长时间？",
    "en": "Excuse me, about how long does it take to walk to the beach?",
    "hint": "Use “How long does it take to …?” to ask about duration."
  },
  {
    "zh": "我们应该给自己留出足够的转机时间。",
    "en": "We should allow ourselves enough time for the connection.",
    "hint": "“Allow enough time” means plan for sufficient time."
  },
  {
    "zh": "我把护照放在包里了，但现在找不到。",
    "en": "I put my passport in my bag, but I can't find it now.",
    "hint": "“Put” has the same form in the present and past."
  },
  {
    "zh": "虽然旅途很累，但沿途的风景非常值得。",
    "en": "Although the journey was tiring, the scenery along the way made it worthwhile.",
    "hint": "“Make it worthwhile” explains why an effort was worth making."
  },
  {
    "zh": "我想学习如何更清楚地表达自己的观点。",
    "en": "I want to learn how to express my opinions more clearly.",
    "hint": "Use “how to” after “learn”."
  },
  {
    "zh": "每次遇到生词，我都会先根据上下文猜意思。",
    "en": "Whenever I come across an unfamiliar word, I first try to guess its meaning from the context.",
    "hint": "“Come across” means encounter something."
  },
  {
    "zh": "与其死记单词，不如把它们放在句子里练习。",
    "en": "Instead of memorizing words mechanically, practice using them in sentences.",
    "hint": "Keep the phrase after “instead of” in the -ing form."
  },
  {
    "zh": "我能看懂大部分内容，但说起来还不够流利。",
    "en": "I can understand most of the content, but I'm still not very fluent when I speak.",
    "hint": "“Fluent” describes speaking smoothly and easily."
  },
  {
    "zh": "你能说慢一点，让我记下来吗？",
    "en": "Could you speak a little more slowly so I can write it down?",
    "hint": "“Write it down” means record something in writing."
  },
  {
    "zh": "这个词在正式和非正式场合的用法不同。",
    "en": "This word is used differently in formal and informal situations.",
    "hint": "Use the passive voice to describe how a word is used."
  },
  {
    "zh": "我最近开始用英语写日记。",
    "en": "I've recently started keeping a diary in English.",
    "hint": "“Keep a diary” is a natural expression for 写日记."
  },
  {
    "zh": "如果只看答案而不自己练习，就很难真正进步。",
    "en": "It's hard to make real progress if you only look at the answers without practicing yourself.",
    "hint": "Use “without” followed by an -ing form."
  },
  {
    "zh": "我想先自己试一下，然后再看参考答案。",
    "en": "I'd like to try it myself first and then look at the reference answer.",
    "hint": "Use “first” and “then” to show the order of actions."
  },
  {
    "zh": "你能举个例子说明这两个词的区别吗？",
    "en": "Could you give an example to explain the difference between these two words?",
    "hint": "Use “the difference between … and …” or “between these two …”."
  },
  {
    "zh": "我答应自己每天至少练习十分钟。",
    "en": "I promised myself I would practice for at least ten minutes every day.",
    "hint": "“At least” sets a minimum amount."
  },
  {
    "zh": "我们应该把大目标分成几个容易完成的小任务。",
    "en": "We should break big goals down into smaller, manageable tasks.",
    "hint": "“Break something down into” means divide it into parts."
  },
  {
    "zh": "我发现把通知关掉以后更容易集中注意力。",
    "en": "I've found it easier to concentrate after turning off notifications.",
    "hint": "Use “find it easier to” to describe a helpful change."
  },
  {
    "zh": "不要因为一天没有进步就放弃整个计划。",
    "en": "Don't give up on the whole plan just because you haven't made progress for one day.",
    "hint": "“Give up on” means stop believing in or pursuing something."
  },
  {
    "zh": "她用了几个月的时间养成了每天阅读的习惯。",
    "en": "It took her a few months to develop the habit of reading every day.",
    "hint": "Use “the habit of” followed by an -ing form."
  },
  {
    "zh": "我希望下个月能比现在更有信心。",
    "en": "I hope I'll feel more confident next month than I do now.",
    "hint": "Use a comparative adjective to contrast the two times."
  },
  {
    "zh": "只要方法合适，短时间的练习也能有效果。",
    "en": "As long as you use the right approach, even short practice sessions can be effective.",
    "hint": "Use “as long as” to introduce the condition."
  },
  {
    "zh": "休息并不是浪费时间，而是为了更好地继续。",
    "en": "Resting isn't a waste of time; it helps you carry on more effectively.",
    "hint": "“Carry on” means continue."
  },
  {
    "zh": "我正在学习接受自己不可能事事完美。",
    "en": "I'm learning to accept that I can't be perfect at everything.",
    "hint": "Use a “that” clause after “accept”."
  },
  {
    "zh": "当任务太多时，我会先列出最重要的三件事。",
    "en": "When I have too many tasks, I start by listing the three most important ones.",
    "hint": "“Start by” is followed by an -ing form."
  },
  {
    "zh": "我们不能控制一切，但可以选择如何回应。",
    "en": "We can't control everything, but we can choose how to respond.",
    "hint": "Use “how to” to express a choice of approach."
  },
  {
    "zh": "这段经历让我明白了耐心的重要性。",
    "en": "This experience taught me the importance of patience.",
    "hint": "Use “teach someone the importance of something”."
  },
  {
    "zh": "如果有机会重新开始，我还是会做同样的选择。",
    "en": "If I had the chance to start over, I would make the same choice.",
    "hint": "Use the second conditional for a hypothetical choice."
  },
  {
    "zh": "有时候，问一个好问题比立刻给出答案更有帮助。",
    "en": "Sometimes asking a good question is more helpful than giving an immediate answer.",
    "hint": "Compare two -ing phrases with “more helpful than”."
  },
  {
    "zh": "我还在学习，但我已经比昨天更进一步了。",
    "en": "I'm still learning, but I've already taken another step forward since yesterday.",
    "hint": "“Take a step forward” can describe making progress."
  }
];

export default [...exercises, ...additionalExercises];
