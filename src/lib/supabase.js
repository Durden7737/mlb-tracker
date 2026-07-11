// ═══════════════════════════════════════════════════════════════════
// MLB BETS — SUPABASE CLIENT + CONSTANTS
// ═══════════════════════════════════════════════════════════════════
//
// SETUP (one-time, ~5 minutes):
//   1) Uses the SAME Supabase project as the TENNIS tracker (tennis-betting).
//   2) Open that project's SQL Editor and paste in mlb_setup.sql (in the
//      MLB folder). It sets aside the old April snapshot table and creates
//      the new mlb_bets / mlb_staged_bets tables.
//   3) That's it — URL + key below are already filled in.
//
// Until the mlb_bets table exists, the tracker falls back to LOCAL-ONLY
// mode (data lives only in this browser, no iPhone↔Mac sync). The page
// still works for testing.
// ═══════════════════════════════════════════════════════════════════

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const SUPABASE_URL = 'https://coyamzthjdcpogxvzfea.supabase.co'
const SUPABASE_KEY = 'sb_publishable_R8x9bfyktMP1DHrHnVLI8g_lGk7aZYh'

const isConfigured =
  SUPABASE_URL && SUPABASE_KEY &&
  !SUPABASE_URL.startsWith('YOUR_') &&
  !SUPABASE_KEY.startsWith('YOUR_')

export const SUPABASE_CONFIGURED = isConfigured

// Real client OR local-only shim — same interface either way.
export const supabase = isConfigured
  ? createClient(SUPABASE_URL, SUPABASE_KEY)
  : makeLocalShim()

// ── FORMATTERS ────────────────────────────────────────────────────
export function COP(value) {
  const n = Number(value) || 0
  return n.toLocaleString('es-CO', {
    style: 'currency', currency: 'COP',
    minimumFractionDigits: 0, maximumFractionDigits: 0,
  })
}

export function PCT(value) {
  const n = Number(value) || 0
  const pct = Math.abs(n) <= 1 ? n * 100 : n
  return pct.toFixed(1) + '%'
}

// ── DROPDOWN CONSTANTS ────────────────────────────────────────────

/** League / phase of the game — drives the colored dot beside each bet. */
export const REGIONS = [
  'AL',
  'NL',
  'Interleague',
  'Postseason',
  'International',
  'Other',
]

/** Round / series labels covering the MLB season + postseason + specials. */
export const MATCHDAYS = [
  'Regular Season',
  'Opening Day',
  'Spring Training',
  'Doubleheader G1', 'Doubleheader G2',
  'Wild Card',
  'ALDS', 'NLDS',
  'ALCS', 'NLCS',
  'World Series',
  'Game 1', 'Game 2', 'Game 3', 'Game 4', 'Game 5', 'Game 6', 'Game 7',
  'All-Star Game',
  'Home Run Derby',
  'Series Opener', 'Series Finale',
  'Group Stage', 'QF', 'SF', 'F', 'Final',
  'Other',
]

/** Bet markets — full baseball coverage (ML, run line, totals, F5, NRFI, pitcher/batter props, futures, etc.). */
export const BET_TYPES = [
  'Moneyline',
  'Run Line (-1.5/+1.5)',
  'Alternate Run Line',
  'Total Runs (Over/Under)',
  'Team Total Runs',
  'First 5 Innings — Moneyline',
  'First 5 Innings — Run Line',
  'First 5 Innings — Total',
  'First Inning Runs (NRFI/YRFI)',
  'Team To Score First',
  'Pitcher Strikeouts',
  'Pitcher Outs Recorded',
  'Pitcher Earned Runs',
  'Pitcher Hits Allowed',
  'Pitcher Walks',
  'Pitcher To Record Win',
  'Batter Hits',
  'Batter Total Bases',
  'Batter Home Run',
  'Batter RBIs',
  'Batter Runs Scored',
  'Batter Hits + Runs + RBIs',
  'Batter Singles/Doubles/Triples',
  'Batter Stolen Bases',
  'Batter Walks',
  'Batter Strikeouts',
  'Player Props',
  'Series Winner',
  'Futures (Division/Pennant/WS)',
  'Grand Slam / Specials',
  'Specials',
  'Live',
  'System',
  'Parlay',
  'Other',
  'Tracking (Win %)',
]

/** Competition categories. */
export const COMPETITION_TYPES = [
  'Regular Season',
  'Postseason',
  'Spring Training',
  'All-Star Event',
  'International Tournament',
  'Winter League',
  'Other Pro League',
  'Other',
]

/**
 * Preloaded competitions for the autocomplete.
 * Each entry: [name, region, competition_type] — picking one auto-fills region + type.
 */
export const COMPETITIONS = [
  // ───── MLB SEASON ─────
  ['MLB Regular Season',            'AL',            'Regular Season'],
  ['MLB Regular Season (AL)',       'AL',            'Regular Season'],
  ['MLB Regular Season (NL)',       'NL',            'Regular Season'],
  ['MLB Interleague',               'Interleague',   'Regular Season'],
  ['MLB Spring Training',           'Other',         'Spring Training'],
  ['MLB Opening Day',               'Interleague',   'Regular Season'],

  // ───── POSTSEASON ─────
  ['MLB Wild Card Series',          'Postseason',    'Postseason'],
  ['ALDS',                          'Postseason',    'Postseason'],
  ['NLDS',                          'Postseason',    'Postseason'],
  ['ALCS',                          'Postseason',    'Postseason'],
  ['NLCS',                          'Postseason',    'Postseason'],
  ['World Series',                  'Postseason',    'Postseason'],

  // ───── ALL-STAR ─────
  ['MLB All-Star Game',             'Interleague',   'All-Star Event'],
  ['MLB Home Run Derby',            'Interleague',   'All-Star Event'],

  // ───── INTERNATIONAL ─────
  ['World Baseball Classic',        'International', 'International Tournament'],
  ['Premier12',                     'International', 'International Tournament'],
  ['Olympic Baseball',              'International', 'International Tournament'],

  // ───── OTHER PRO LEAGUES ─────
  ['NPB (Japan)',                   'International', 'Other Pro League'],
  ['KBO (Korea)',                   'International', 'Other Pro League'],
  ['LMB (Mexico)',                  'International', 'Other Pro League'],
  ['CPBL (Taiwan)',                 'International', 'Other Pro League'],

  // ───── WINTER LEAGUES ─────
  ['LIDOM (Dominican Republic)',    'International', 'Winter League'],
  ['LVBP (Venezuela)',              'International', 'Winter League'],
  ['LMP (Mexican Pacific)',         'International', 'Winter League'],
  ['Serie del Caribe',              'International', 'Winter League'],

  // ───── MINORS ─────
  ['Triple-A (MiLB)',               'Other',         'Other Pro League'],
  ['Double-A (MiLB)',               'Other',         'Other Pro League'],
]

// ═══════════════════════════════════════════════════════════════════
// LOCAL-ONLY SHIM — used until Supabase is configured.
// Mimics just enough of the supabase-js API for this app: from(table)
// .select / .insert / .update / .delete / .eq / .order, returning
// { data, error } promises.
// ═══════════════════════════════════════════════════════════════════
function makeLocalShim() {
  const STORAGE_KEY = 'mlb_local_bets'
  const NEXT_ID_KEY = 'mlb_local_next_id'

  const load = () => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] }
  }
  const save = (rows) => localStorage.setItem(STORAGE_KEY, JSON.stringify(rows))
  const nextId = () => {
    const v = parseInt(localStorage.getItem(NEXT_ID_KEY) || '1', 10)
    localStorage.setItem(NEXT_ID_KEY, String(v + 1))
    return v
  }
  const compute = (b) => {
    const stake = Number(b.stake_cop) || 0
    const odds  = Number(b.odds) || 0
    const tracking = b.bet_type === 'Tracking (Win %)'
    const potential_cop = tracking ? 0 : stake * odds
    let pl_cop = null
    if (b.result === 1)      pl_cop = tracking ? 0 : (potential_cop - stake)
    else if (b.result === 0) pl_cop = tracking ? 0 : -stake
    return { ...b, potential_cop, pl_cop }
  }

  const from = (table) => {
    // We support mlb_bets (writes) and mlb_bets_with_calc (reads)
    const isViewName = (table === 'mlb_bets_with_calc')
    let _filterField = null
    let _filterValue = null
    let _orderField  = null
    let _orderAsc    = true

    const builder = {
      select() { return builder },
      eq(field, value) { _filterField = field; _filterValue = value; return builder },
      order(field, opts = {}) { _orderField = field; _orderAsc = !!opts.ascending; return builder },
      then(resolve) {
        let out = isViewName ? load().map(compute) : load()
        if (_filterField !== null) out = out.filter(r => r[_filterField] === _filterValue)
        if (_orderField) {
          out.sort((a, b) => {
            const av = a[_orderField], bv = b[_orderField]
            if (av === bv) return 0
            return (av > bv ? 1 : -1) * (_orderAsc ? 1 : -1)
          })
        }
        resolve({ data: out, error: null })
      },
      insert(payloads) {
        const cur = load()
        const items = Array.isArray(payloads) ? payloads : [payloads]
        items.forEach(p => cur.push({ id: nextId(), result: null, ...p }))
        save(cur)
        return Promise.resolve({ data: items, error: null })
      },
      update(patch) {
        return {
          eq(field, value) {
            const cur = load()
            const i = cur.findIndex(r => r[field] === value)
            if (i === -1) return Promise.resolve({ data: null, error: { message: 'Not found' } })
            cur[i] = { ...cur[i], ...patch }
            save(cur)
            return Promise.resolve({ data: cur[i], error: null })
          }
        }
      },
      delete() {
        return {
          eq(field, value) {
            const cur = load().filter(r => r[field] !== value)
            save(cur)
            return Promise.resolve({ data: null, error: null })
          }
        }
      },
    }
    return builder
  }

  return { from }
}
