'use client'
import { NewsArticle } from '@/types'
import { SignalScore } from '@/components/ui/SignalScore'
import { timeAgo } from '@/lib/utils'
import { ExternalLink } from 'lucide-react'

interface MacroDevelopmentsProps {
  articles: NewsArticle[]
}

export function MacroDevelopments({ articles }: MacroDevelopmentsProps) {
  return (
    <div className="bg-[#0F1623] border border-[#1E2A3B] rounded-md">
      <div className="px-4 py-3 border-b border-[#1E2A3B] flex items-center justify-between">
        <h3 className="text-xs font-semibold text-[#7A8FA6] uppercase tracking-wider">Recent Macro Developments</h3>
        <span className="text-xs text-[#4A5A6E]">Signal score = market impact</span>
      </div>
      <div className="divide-y divide-[#1E2A3B]">
        {articles.map(article => (
          <div key={article.id} className="px-4 py-3 flex items-start gap-4 hover:bg-[#161D2E] transition-colors group">
            <div className="shrink-0 mt-0.5">
              <SignalScore score={article.marketMovingScore} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-[#E8EDF5] leading-snug mb-1">{article.headline}</p>
              <div className="flex items-center gap-3 text-xs text-[#4A5A6E]">
                <span className="font-medium text-[#7A8FA6]">{article.source}</span>
                <span>{timeAgo(article.publishedAt)}</span>
                <div className="flex gap-1">
                  {article.countries.slice(0, 2).map(c => (
                    <span key={c} className="font-mono bg-[#161D2E] px-1 rounded">{c}</span>
                  ))}
                </div>
              </div>
            </div>
            <a href={article.url} className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-[#4A5A6E] hover:text-[#00C2FF]">
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}
