"use client";

import { Star } from "lucide-react";
import { useState } from "react";
import { submitFeedbackAction } from "@/app/actions/feedback";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function FeedbackForm({
  batchId,
  batchNo,
}: {
  batchId: string;
  batchNo: string;
}) {
  const [rating, setRating] = useState(5);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    formData.append("rating", rating.toString());
    const res = await submitFeedbackAction(formData);
    setLoading(false);
    if (res.success) {
      setSubmitted(true);
    } else {
      alert("提交失败，请重试");
    }
  }

  if (submitted) {
    return (
      <Card className="mt-8 bg-green-50 border-green-100">
        <CardContent className="p-8 text-center text-green-800">
          <div className="text-4xl mb-2">🎉</div>
          <h3 className="font-bold text-lg">感谢您的评价！</h3>
          <p className="text-sm opacity-80 mt-1">
            您的反馈将帮助我们做得更好。
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-8 border-none shadow-lg overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-yellow-400 to-orange-500" />
      <CardContent className="p-6">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center">
          <Star className="w-5 h-5 mr-2 text-yellow-500 fill-yellow-500" />
          消费者评价反馈
        </h3>
        <form action={handleSubmit} className="space-y-4">
          <input type="hidden" name="batch_id" value={batchId} />
          <input type="hidden" name="batch_no" value={batchNo} />

          <div>
            <span className="text-xs font-medium text-gray-500 mb-2 block">
              请为该西瓜品质打分
            </span>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setRating(s)}
                  className="focus:outline-none transition-transform hover:scale-110"
                  aria-label={`Rate ${s} stars`}
                >
                  <Star
                    className={`w-8 h-8 ${s <= rating
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-200"
                      }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="content" className="text-xs font-medium text-gray-500 mb-1 block">
              您的评价建议 (可选)
            </label>
            <Textarea
              id="content"
              name="content"
              placeholder="口感如何？甜度满意吗？欢迎吐槽或点赞..."
              className="resize-none bg-gray-50 border-gray-200"
            />
          </div>

          <div>
            <label htmlFor="contact" className="text-xs font-medium text-gray-500 mb-1 block">
              联系方式 (可选)
            </label>
            <Input
              id="contact"
              name="contact"
              placeholder="手机号 (仅售后回访使用)"
              className="bg-gray-50 border-gray-200"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white font-bold shadow-md"
          >
            {loading ? "提交中..." : "提交反馈"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
