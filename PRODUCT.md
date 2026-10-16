\# TradeLens — Product Definition (v1)



\## Problem

Beginner crypto traders lose money not just from bad market calls, but from

breaking their own trading rules — oversizing positions, entering on FOMO,

moving stop losses, revenge trading after a loss. Most journals only show

PnL and win rate, so traders can't tell whether their losses come from weak

setups or from broken discipline.



\## Core User

A manual crypto spot/futures trader (e.g. on Binance or Bybit) who wants to

trade with more discipline and understand their own behavioral patterns.



\## Core Promise

TradeLens tracks trades and shows whether poor results come from bad setups

or from broken trading rules — something standard journals don't separate.



\## Version 1 Scope

\- Email/password authentication with protected routes

\- User profile: display name, starting balance, max risk % per trade

\- Manual trade entry: pair, direction, entry, exit, stop loss, target,

&#x20; size, leverage, fees, setup, notes, trade date

\- Automatic calculations: gross PnL, net PnL, PnL %, risk amount,

&#x20; planned risk-reward ratio, result (win/loss/breakeven)

\- Pre-trade discipline checklist + "followed plan" flag

\- Mistake tagging (FOMO, revenge trade, moved stop, etc.)

\- Risk-limit warning if planned risk exceeds the user's max rule

\- Dashboard: total PnL, win rate, profit factor, best/worst trade,

&#x20; discipline score, followed-plan vs broke-plan comparison

\- Charts: cumulative PnL, monthly PnL, win/loss distribution,

&#x20; performance by setup, followed-plan vs broke-plan

\- Filtering by date, pair, setup, direction, result, rule adherence

\- Weekly review page with simple rule-based suggestions

\- Mobile-responsive dark-themed UI

\- Deployment to a live URL (Vercel or Netlify)



\## Out of Scope for v1

\- Exchange API integration / automated trade import

\- Trading bots or automated execution

\- AI trading signals

\- Social features or public profiles

\- Real-time price charts

\- Native mobile app

\- Payment subscriptions

\- Multi-currency support beyond USD display



These may be considered only after v1 is live and stable.



\## User Stories



\### Auth \& Profile

\- As a trader, I can sign up, log in, and log out.

\- As a trader, my session persists after a page refresh.

\- As a trader, I can set my starting balance and max risk % per trade.



\### Trade CRUD

\- As a trader, I can add a trade with entry, exit, stop loss, target,

&#x20; size, fees, and notes.

\- As a trader, I can see PnL, risk amount, and planned R:R calculated

&#x20; automatically.

\- As a trader, I can edit or delete a trade I created.



\### Discipline

\- As a trader, I complete a pre-trade checklist and mark whether I

&#x20; followed my plan.

\- As a trader, I get warned if my planned risk exceeds my max risk rule.

\- As a trader, I can tag mistakes (FOMO, revenge trade, moved stop, etc.).



\### Analytics \& Review

\- As a trader, I can see win rate, profit factor, and PnL split by

&#x20; followed-plan vs broke-plan.

\- As a trader, I can filter trades by date, pair, setup, and result.

\- As a trader, I get a weekly summary of what went wrong and what worked.

