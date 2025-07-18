import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">ড্যাশবোর্ড ওভারভিউ</h2>
        {/* আপনি এখানে যেকোনো ফিল্টার বা বাটন যোগ করতে পারেন */}
      </div>
      <Separator />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">মোট রোগী</CardTitle>
            {/* আইকন */}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৫০</div>
            <p className="text-xs text-muted-foreground">+২০% গত মাস থেকে</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">আজকের পরামর্শ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৫</div>
            <p className="text-xs text-muted-foreground">+২ গত দিনের থেকে</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">আসন্ন অ্যাপয়েন্টমেন্ট</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">১০</div>
            <p className="text-xs text-muted-foreground">আগামী ৭ দিনে</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">মোট ঔষধ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">১০০+</div>
            <p className="text-xs text-muted-foreground">স্টকে আছে</p>
          </CardContent>
        </Card>
      </div>
      {/* এখানে আপনি অন্যান্য ড্যাশবোর্ড কন্টেন্ট যেমন চার্ট, টেবিল যোগ করতে পারেন */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>মাসিক রোগী ভর্তি</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            {/* এখানে একটি চার্ট কম্পোনেন্ট যোগ করতে পারেন, যেমন Recharts থেকে */}
            <div className="h-[300px] bg-muted/50 rounded-lg flex items-center justify-center">
              <span>চার্ট এখানে যাবে</span>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>সাম্প্রতিক কার্যক্রম</CardTitle>
          </CardHeader>
          <CardContent>
            {/* সাম্প্রতিক কার্যক্রমের তালিকা */}
            <ul className="space-y-2">
              <li>নতুন রোগী যোগ করা হয়েছে: জন ডো</li>
              <li>পরামর্শ সম্পন্ন: জেন স্মিথ</li>
              <li>ঔষধ আপডেট করা হয়েছে: Arsenicum Album 30C</li>
              <li>নতুন অ্যাপয়েন্টমেন্ট: ১৫ জুন, ১০:০০ AM - ডেভিড লি</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}