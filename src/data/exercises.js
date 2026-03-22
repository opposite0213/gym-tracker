export const CATEGORIES = ['胸', '背中', '肩', '腕', '脚', 'その他']

export const PRESET_EXERCISES = [
  { name: 'ベンチプレス',      category: '胸' },
  { name: 'インクラインプレス', category: '胸' },
  { name: 'ダンベルフライ',    category: '胸' },
  { name: 'ディップス',        category: '胸' },
  { name: 'ロー',              category: '背中' },
  { name: 'ラットプルダウン',  category: '背中' },
  { name: 'アシストチン',      category: '背中' },
  { name: 'デッドリフト',      category: '背中' },
  { name: 'シーテッドロー',    category: '背中' },
  { name: 'ショルダープレス',  category: '肩' },
  { name: 'サイドレイズ',      category: '肩' },
  { name: 'フロントレイズ',    category: '肩' },
  { name: 'バーベルカール',    category: '腕' },
  { name: 'ダンベルカール',    category: '腕' },
  { name: 'トライセプスプッシュダウン', category: '腕' },
  { name: 'スクワット',        category: '脚' },
  { name: 'レッグプレス',      category: '脚' },
  { name: 'レッグカール',      category: '脚' },
  { name: 'カーフレイズ',      category: '脚' },
]

export const CATEGORY_COLORS = {
  '胸':   { bg: '#ff2d5520', text: '#ff2d55', border: '#ff2d5540' },
  '背中': { bg: '#007aff20', text: '#007aff', border: '#007aff40' },
  '肩':   { bg: '#ff9f0a20', text: '#ff9f0a', border: '#ff9f0a40' },
  '腕':   { bg: '#30d15820', text: '#30d158', border: '#30d15840' },
  '脚':   { bg: '#bf5af220', text: '#bf5af2', border: '#bf5af240' },
  'その他': { bg: '#636366', text: '#aeaeb2', border: '#48484a' },
}
