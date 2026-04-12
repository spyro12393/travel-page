export type ActivityCategory =
  | 'flight'
  | 'transport'
  | 'food'
  | 'attraction'
  | 'shopping'
  | 'hotel'
  | 'task'

export interface Activity {
  time?: string
  icon: string
  title: string
  subtitle?: string
  mapQuery?: string
  category: ActivityCategory
}

export interface DayItinerary {
  day: number
  date: string
  weekday: string
  theme: string
  themeIcon: string
  gradient: string
  activities: Activity[]
}

export const checklist = [
  { id: 1, icon: '📶', text: '網卡 / 行動電源 🔋' },
  { id: 2, icon: '📱', text: 'Visit Japan Web (VJW) 截圖' },
  { id: 3, icon: '🥾', text: '裝備：登山鞋、保暖衣物 ❄️' },
]

export const itinerary: DayItinerary[] = [
  {
    day: 1,
    date: '04.16',
    weekday: '四',
    theme: '名古屋初見：國寶城與首波採買',
    themeIcon: '🏯',
    gradient: 'from-red-600 to-rose-400',
    activities: [
      {
        time: '07:30 - 11:20',
        icon: '✈️',
        title: '航班 CI0154',
        subtitle: 'TPE T2 ➔ NGO T1',
        category: 'flight',
        mapQuery: '桃園國際機場 第二航廈',
      },
      {
        time: '11:20 - 13:00',
        icon: '🚆',
        title: '名鐵特急',
        subtitle: '機場前往名古屋市區',
        category: 'transport',
        mapQuery: '中部国際空港駅 名鉄',
      },
      {
        time: '13:00',
        icon: '🏨',
        title: '三井花園飯店名古屋普米爾',
        subtitle: 'Check-in',
        category: 'hotel',
        mapQuery: '三井ガーデンホテル名古屋プレミア',
      },
      {
        time: '14:15 - 18:00',
        icon: '🏯',
        title: '國寶犬山城',
        subtitle: '日本現存最古老的木造天守閣',
        category: 'attraction',
        mapQuery: '犬山城 愛知県犬山市',
      },
      {
        time: '18:00',
        icon: '🍜',
        title: '晚餐：山本屋總本家',
        subtitle: '名古屋名物味噌煮込烏龍麵',
        category: 'food',
        mapQuery: '山本屋総本家 名古屋',
      },
      {
        time: '20:00',
        icon: '🛍️',
        title: '購物',
        subtitle: 'Uniqlo 名古屋店 & MEGA 唐吉訶德',
        category: 'shopping',
        mapQuery: 'MEGAドン・キホーテ 名古屋',
      },
    ],
  },
  {
    day: 2,
    date: '04.17',
    weekday: '五',
    theme: '飛驒高山：古街與燒肉之約',
    themeIcon: '🐮',
    gradient: 'from-orange-500 to-amber-400',
    activities: [
      {
        time: '08:43 - 11:00',
        icon: '🚄',
        title: 'JR 特急 Wide View 飛驒號',
        subtitle: '名古屋 ➔ 高山',
        category: 'transport',
        mapQuery: '名古屋駅 JR在来線',
      },
      {
        time: '11:00',
        icon: '🏨',
        title: 'eph TAKAYAMA',
        subtitle: '寄放行李',
        category: 'hotel',
        mapQuery: 'eph TAKAYAMA 高山市',
      },
      {
        time: '12:00',
        icon: '🍚',
        title: '午餐：坂口屋',
        subtitle: '高山名物飛驒牛料理',
        category: 'food',
        mapQuery: '坂口屋 高山市',
      },
      {
        time: '13:40 - 17:30',
        icon: '🏮',
        title: '高山老街散策',
        subtitle: '飛驒高山古い町並み',
        category: 'attraction',
        mapQuery: '飛騨高山 古い町並み',
      },
      {
        time: '17:30',
        icon: '🎫',
        title: '任務：換濃飛巴士「兩日券」',
        subtitle: '濃飛巴士中心',
        category: 'task',
        mapQuery: '濃飛バスセンター 高山',
      },
      {
        time: '18:00',
        icon: '🔥',
        title: '晚餐：丸明燒肉',
        subtitle: '飛驒牛燒肉',
        category: 'food',
        mapQuery: '丸明 高山市',
      },
    ],
  },
  {
    day: 3,
    date: '04.18',
    weekday: '六',
    theme: '上高地與新穗高：阿爾卑斯絕景',
    themeIcon: '🏔️',
    gradient: 'from-sky-600 to-blue-400',
    activities: [
      {
        time: '07:40 - 09:10',
        icon: '🚌',
        title: '濃飛巴士',
        subtitle: '高山 ➔ 上高地',
        category: 'transport',
        mapQuery: '高山濃飛バスセンター',
      },
      {
        time: '09:10 - 11:10',
        icon: '🥾',
        title: '上高地健行',
        subtitle: '大正池 ➔ 河童橋，北阿爾卑斯山絕景',
        category: 'attraction',
        mapQuery: '上高地 大正池 長野県',
      },
      {
        time: '13:30 - 15:30',
        icon: '🚠',
        title: '新穗高纜車',
        subtitle: '必吃：可頌、飛驒牛咖哩麵包',
        category: 'attraction',
        mapQuery: '新穂高ロープウェイ 岐阜県',
      },
      {
        time: '18:00',
        icon: '🍜',
        title: '晚餐：麵屋白川',
        subtitle: '回到高山',
        category: 'food',
        mapQuery: '麺屋白川 高山市',
      },
    ],
  },
  {
    day: 4,
    date: '04.19',
    weekday: '日',
    theme: '合掌村與名古屋購物衝刺',
    themeIcon: '🛖',
    gradient: 'from-emerald-600 to-teal-400',
    activities: [
      {
        time: '07:20 - 09:00',
        icon: '🍎',
        title: '宮川朝市',
        subtitle: '高山最熱鬧的晨市',
        category: 'attraction',
        mapQuery: '宮川朝市 高山市',
      },
      {
        time: '09:30 - 10:20',
        icon: '🚌',
        title: '濃飛巴士',
        subtitle: '高山 ➔ 合掌村（白川鄉）',
        category: 'transport',
        mapQuery: '白川郷バス停',
      },
      {
        time: '10:30 - 14:30',
        icon: '🛖',
        title: '合掌村',
        subtitle: '展望台、和田家、三小屋，世界遺產',
        category: 'attraction',
        mapQuery: '白川郷 合掌造り集落 岐阜県',
      },
      {
        time: '15:00 - 18:00',
        icon: '🚌',
        title: '返回名古屋',
        category: 'transport',
        mapQuery: '白川郷バスターミナル',
      },
      {
        time: '18:30',
        icon: '🍓',
        title: '戰利品：弁才天水果大福',
        category: 'food',
        mapQuery: '弁才天 名古屋 水果大福',
      },
    ],
  },
  {
    day: 5,
    date: '04.20',
    weekday: '一',
    theme: '吉卜力與鰻魚飯傳奇',
    themeIcon: '🐉',
    gradient: 'from-violet-600 to-purple-400',
    activities: [
      {
        time: '08:00 - 09:00',
        icon: '☕',
        title: '早餐：喫茶 Tsuzuki',
        subtitle: '名古屋名物倒咖啡特技',
        category: 'food',
        mapQuery: '喫茶ツヅキ 名古屋',
      },
      {
        time: '10:00 - 14:30',
        icon: '🌳',
        title: '吉卜力公園',
        subtitle: '大倉庫 12:00 已預約',
        category: 'attraction',
        mapQuery: 'ジブリパーク 愛知県長久手市',
      },
      {
        time: '15:30 - 17:30',
        icon: '⛩️',
        title: '熱田神宮',
        subtitle: '先抽蓬萊軒號碼牌',
        category: 'attraction',
        mapQuery: '熱田神宮 名古屋市',
      },
      {
        time: '17:30',
        icon: '🍱',
        title: '晚餐：熱田蓬萊軒',
        subtitle: '名古屋名物鰻魚飯（ひつまぶし）',
        category: 'food',
        mapQuery: '熱田蓬来軒 名古屋',
      },
    ],
  },
  {
    day: 6,
    date: '04.21',
    weekday: '二',
    theme: '蝦餅衝刺：機場巡禮返家',
    themeIcon: '✈️',
    gradient: 'from-slate-700 to-slate-500',
    activities: [
      {
        time: '09:30',
        icon: '🚆',
        title: 'μ-SKY 前往機場',
        subtitle: '名鐵名古屋站出發',
        category: 'transport',
        mapQuery: '名鉄名古屋駅',
      },
      {
        time: '10:10',
        icon: '🦐',
        title: '任務：えびせんべいの里',
        subtitle: '務必在入關前買好！',
        category: 'task',
        mapQuery: 'えびせんべいの里 中部国際空港',
      },
      {
        time: '12:20 - 14:30',
        icon: '✈️',
        title: '航班 CI0155',
        subtitle: 'NGO T1 ➔ TPE',
        category: 'flight',
        mapQuery: '中部国際空港 セントレア',
      },
    ],
  },
]
