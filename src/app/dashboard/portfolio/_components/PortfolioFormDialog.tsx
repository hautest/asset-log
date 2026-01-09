"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Textarea } from "@/shared/ui/textarea";
import { X, Search, Loader2 } from "lucide-react";
import { createPortfolio } from "@/features/portfolio/server-functions/createPortfolio";
import { updatePortfolio } from "@/features/portfolio/server-functions/updatePortfolio";
import { searchStocksAction } from "@/features/portfolio/server-functions/searchStocks";
import { toast } from "sonner";

interface StockResult {
  ticker: string;
  name: string;
  exchange: string;
}

interface PortfolioItemInput {
  ticker: string;
  name: string;
  weight: number;
}

interface PortfolioFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  portfolio?: {
    id: string;
    name: string;
    description: string | null;
    items: PortfolioItemInput[];
  };
}

export function PortfolioFormDialog({
  open,
  onOpenChange,
  portfolio,
}: PortfolioFormDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [items, setItems] = useState<PortfolioItemInput[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<StockResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!portfolio;

  useEffect(() => {
    if (open && portfolio) {
      setName(portfolio.name);
      setDescription(portfolio.description || "");
      setItems(portfolio.items);
    } else if (open) {
      setName("");
      setDescription("");
      setItems([]);
    }
    setSearchQuery("");
    setSearchResults([]);
  }, [open, portfolio]);

  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);
    if (query.length < 1) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchStocksAction(query);
      setSearchResults(results);
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleAddStock = (stock: StockResult) => {
    if (items.some((item) => item.ticker === stock.ticker)) {
      toast.error("이미 추가된 종목입니다");
      return;
    }

    setItems([...items, { ticker: stock.ticker, name: stock.name, weight: 0 }]);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleRemoveStock = (ticker: string) => {
    setItems(items.filter((item) => item.ticker !== ticker));
  };

  const handleWeightChange = (ticker: string, weight: number) => {
    setItems(
      items.map((item) =>
        item.ticker === ticker ? { ...item, weight } : item
      )
    );
  };

  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("포트폴리오 이름을 입력하세요");
      return;
    }

    if (items.length === 0) {
      toast.error("최소 1개 이상의 종목을 추가하세요");
      return;
    }

    if (totalWeight !== 100) {
      toast.error("총 비중이 100%가 되어야 합니다");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing) {
        await updatePortfolio({
          id: portfolio.id,
          name: name.trim(),
          description: description.trim() || undefined,
          items,
        });
        toast.success("포트폴리오가 수정되었습니다");
      } else {
        await createPortfolio({
          name: name.trim(),
          description: description.trim() || undefined,
          items,
        });
        toast.success("포트폴리오가 생성되었습니다");
      }
      onOpenChange(false);
    } catch (error) {
      toast.error(
        isEditing ? "수정에 실패했습니다" : "생성에 실패했습니다"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "포트폴리오 수정" : "새 포트폴리오"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">이름 *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 배당 성장 포트폴리오"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">설명</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="포트폴리오에 대한 설명 (선택)"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>종목 검색</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="종목명 또는 티커 검색 (예: AAPL, 삼성전자)"
                className="pl-10"
              />
              {isSearching && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-slate-400" />
              )}
            </div>

            {searchResults.length > 0 && (
              <div className="border rounded-md max-h-48 overflow-y-auto">
                {searchResults.map((stock) => (
                  <button
                    key={stock.ticker}
                    className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center justify-between text-sm"
                    onClick={() => handleAddStock(stock)}
                  >
                    <span>
                      <span className="font-medium">{stock.ticker}</span>
                      <span className="text-slate-500 ml-2">{stock.name}</span>
                    </span>
                    <span className="text-xs text-slate-400">
                      {stock.exchange}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>종목 구성</Label>
                <span
                  className={`text-sm font-medium ${
                    totalWeight === 100
                      ? "text-emerald-600"
                      : "text-orange-500"
                  }`}
                >
                  총 비중: {totalWeight}%
                </span>
              </div>

              <div className="space-y-2">
                {items.map((item) => (
                  <div
                    key={item.ticker}
                    className="flex items-center gap-2 p-2 bg-slate-50 rounded-md"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {item.ticker}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {item.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        value={item.weight}
                        onChange={(e) =>
                          handleWeightChange(
                            item.ticker,
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="w-16 h-8 text-center"
                      />
                      <span className="text-sm text-slate-500">%</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0"
                      onClick={() => handleRemoveStock(item.ticker)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? "수정" : "생성"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
