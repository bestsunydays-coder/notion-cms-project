import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GitBranch, ArrowRight, Code2, Zap, Palette } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/50">
      <header className="sticky top-0 z-50 border-b border-border/50 backdrop-blur-sm flex justify-center w-full">
        <nav className="max-w-4xl w-full px-6 py-4 flex justify-between items-center">
          <div className="font-bold text-lg">Next.js Starter Kit</div>
          <ThemeToggle />
        </nav>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-20">
        <section className="mb-20 space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              웹 개발을 빠르게 시작하세요
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Next.js 15, TypeScript, Tailwind CSS v4, shadcn/ui로 구성된 현대적인 스타터킷입니다.
              앞으로 나아갈 준비가 되었나요?
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button size="lg" className="sm:w-fit">
              시작하기
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="sm:w-fit">
              <GitBranch className="mr-2 h-4 w-4" />
              GitHub에서 보기
            </Button>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-6 mb-20">
          <Card>
            <CardHeader>
              <Code2 className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>TypeScript</CardTitle>
              <CardDescription>타입 안전성</CardDescription>
            </CardHeader>
            <CardContent>
              완전한 TypeScript 지원으로 개발 중 버그를 조기에 발견하고 코드 품질을 높입니다.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Performance</CardTitle>
              <CardDescription>최적화된 성능</CardDescription>
            </CardHeader>
            <CardContent>
              Next.js 15의 App Router와 Tailwind CSS v4로 빠르고 효율적인 애플리케이션을 구축합니다.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Palette className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Customizable</CardTitle>
              <CardDescription>쉬운 커스터마이징</CardDescription>
            </CardHeader>
            <CardContent>
              shadcn/ui와 Tailwind CSS로 원하는 대로 디자인을 커스터마이징할 수 있습니다.
            </CardContent>
          </Card>
        </section>

        <section className="border border-border rounded-lg p-8 mb-20 bg-card/50 backdrop-blur">
          <h2 className="text-2xl font-bold mb-6">빠른 시작</h2>
          <div className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="max-w-md"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="message">메시지</Label>
              <Input
                id="message"
                placeholder="메시지를 입력하세요..."
                className="max-w-md"
              />
            </div>
            <Button>전송</Button>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">기술 스택</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              'Next.js 15',
              'TypeScript',
              'Tailwind CSS v4',
              'shadcn/ui',
              'lucide-react',
              'next-themes'
            ].map(tech => (
              <div key={tech} className="px-4 py-2 rounded-md bg-muted text-center text-sm font-medium">
                {tech}
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-border/50 mt-20 py-8 flex justify-center w-full">
        <div className="max-w-4xl w-full px-6 text-center text-sm text-muted-foreground">
          <p>© 2025 Next.js Starter Kit. Made with ❤️</p>
        </div>
      </footer>
    </div>
  )
}
