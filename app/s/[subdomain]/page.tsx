import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getSubdomainData } from '@/data/subdomains';
import { protocol, rootDomain } from '@/lib/utils';
import BlurFade from "@/components/magicui/blur-fade";
import BlurFadeText from "@/components/magicui/blur-fade-text";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Icons } from '@/components/icons';
import Markdown from "react-markdown";
import { Badge } from '@/components/ui/badge';
import { ProjectCard } from '@/components/project-card';
import { ResumeCard } from '@/components/resume-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export async function generateMetadata({
  params
}: {
  params: Promise<{ subdomain: string }>;
}): Promise<Metadata> {
  const { subdomain } = await params;
  const subdomainData = await getSubdomainData(subdomain);

  if (!subdomainData) {
    return {
      title: rootDomain
    };
  }

  return {
    title: `${subdomainData.profile?.name || subdomain} - Portfolio`,
    description: subdomainData.profile?.description || `Portfolio of ${subdomainData.profile?.name || subdomain}`,
    openGraph: {
      title: `${subdomainData.profile?.name || subdomain} - Portfolio`,
      description: subdomainData.profile?.description || `Portfolio of ${subdomainData.profile?.name || subdomain}`,
      images: subdomainData.profile?.avatar ? [subdomainData.profile.avatar] : [],
    },
  };
}

const BLUR_FADE_DELAY = 0.04;

export default async function SubdomainPage({
  params
}: {
  params: Promise<{ subdomain: string }>;
}) {
  const { subdomain } = await params;
  const subdomainData = await getSubdomainData(subdomain);

  if (!subdomainData) {
    notFound();
  }

  const profile = subdomainData.profile;

  if (!profile) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 overflow-x-hidden">
      {/* Header with back link */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"></div>
              <span className="font-semibold text-gray-900">{profile.name}</span>
            </div>
            <Link
              href={`${protocol}://${rootDomain}`}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              {rootDomain}
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <section className="mb-20">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <BlurFade delay={BLUR_FADE_DELAY}>
              <div className="flex justify-center mb-8">
                <Avatar className="size-32 border-4 border-white shadow-xl">
                  <AvatarImage alt={profile.name} src={profile.avatar} />
                  <AvatarFallback className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                    {profile.initials}
                  </AvatarFallback>
                </Avatar>
              </div>
            </BlurFade>

            <BlurFadeText
              delay={BLUR_FADE_DELAY * 2}
              className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl"
              yOffset={8}
              text={profile.name}
            />

            <BlurFadeText
              delay={BLUR_FADE_DELAY * 3}
              className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
              text={profile.description}
            />

            <BlurFade delay={BLUR_FADE_DELAY * 4}>
              <div className="flex flex-wrap justify-center gap-3 mt-8">
                {profile.contact?.social?.map((social) => {
                  const IconComponent = Icons[social.icon as keyof typeof Icons] || Icons.globe;
                  return (
                    <Button
                      key={social.url}
                      variant="outline"
                      size="sm"
                      asChild
                      className="gap-2 hover:scale-105 transition-transform"
                    >
                      <a href={social.url} target="_blank" rel="noreferrer">
                        <IconComponent className="size-4" />
                        {social.name}
                      </a>
                    </Button>
                  );
                })}
              </div>
            </BlurFade>
          </div>
        </section>

        {/* About Section */}
        <section className="mb-20">
          <div className="max-w-4xl mx-auto">
            <BlurFade delay={BLUR_FADE_DELAY * 5}>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">About Me</h2>
                <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
              </div>
            </BlurFade>

            <BlurFade delay={BLUR_FADE_DELAY * 6}>
              <Card className="p-8 bg-white/50 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-0">
                  <Markdown
                    components={{
                      p: ({ children }) => (
                        <p className="text-lg text-gray-700 leading-relaxed mb-6 last:mb-0">
                          {children}
                        </p>
                      ),
                      h1: ({ children }) => (
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">
                          {children}
                        </h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-xl font-bold text-gray-900 mb-3">
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {children}
                        </h3>
                      ),
                      ul: ({ children }) => (
                        <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700">
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="list-decimal list-inside space-y-2 mb-6 text-gray-700">
                          {children}
                        </ol>
                      ),
                      li: ({ children }) => (
                        <li className="text-gray-700">
                          {children}
                        </li>
                      ),
                      strong: ({ children }) => (
                        <strong className="font-semibold text-gray-900">
                          {children}
                        </strong>
                      ),
                      em: ({ children }) => (
                        <em className="italic text-gray-700">
                          {children}
                        </em>
                      ),
                      a: ({ href, children }) => (
                        <a
                          href={href}
                          className="text-blue-600 hover:text-blue-800 underline transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {children}
                        </a>
                      ),
                    }}
                  >
                    {profile.summary}
                  </Markdown>
                </CardContent>
              </Card>
            </BlurFade>
          </div>
        </section>

        {/* Skills Section */}
        <section className="mb-20">
          <div className="max-w-4xl mx-auto">
            <BlurFade delay={BLUR_FADE_DELAY * 7}>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Skills & Technologies</h2>
                <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
              </div>
            </BlurFade>

            <BlurFade delay={BLUR_FADE_DELAY * 8}>
              <div className="flex flex-wrap justify-center gap-3">
                {profile.skills.map((skill) => (
                  <Badge
                    key={skill}
                    className="px-4 py-2 text-sm font-medium bg-white/80 backdrop-blur-sm border border-gray-200 hover:bg-white hover:shadow-md transition-all duration-200 hover:scale-105"
                    variant="secondary"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </BlurFade>
          </div>
        </section>

        {/* Work Experience Section */}
        <section className="mb-20">
          <div className="max-w-4xl mx-auto">
            <BlurFade delay={BLUR_FADE_DELAY * 9}>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Work Experience</h2>
                <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
              </div>
            </BlurFade>

            <div className="space-y-6">
              {profile.works.map((work) => (
                <BlurFade
                  key={work.company}
                  delay={BLUR_FADE_DELAY * 10 + 0.1}
                >
                  <ResumeCard
                    logoUrl={work.logoUrl || ''}
                    altText={work.company}
                    title={work.company}
                    subtitle={work.title}
                    href={work.href}
                    badges={work.badges}
                    period={`${work.start} - ${work.end ?? "Present"}`}
                    description={work.description}
                  />
                </BlurFade>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section className="mb-20">
          <div className="max-w-6xl mx-auto">
            <BlurFade delay={BLUR_FADE_DELAY * 11}>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Projects</h2>
                <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
              </div>
            </BlurFade>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profile.projects.map((project) => (
                <BlurFade
                  key={project.title}
                  delay={BLUR_FADE_DELAY * 12 + 0.1}
                >
                  <ProjectCard
                    href={project.href}
                    title={project.title}
                    active={project.active}
                    description={project.description}
                    dates={project.dates}
                    tags={project.technologies}
                    image={project.image || undefined}
                    video={project.video || undefined}
                    links={project.links.map(link => {
                      const IconComponent = Icons[link.type as keyof typeof Icons] || Icons.globe;
                      return {
                        type: link.type,
                        href: link.href,
                        icon: <IconComponent className="size-4" />
                      };
                    })}
                  />
                </BlurFade>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="mb-20">
          <div className="max-w-4xl mx-auto">
            <BlurFade delay={BLUR_FADE_DELAY * 13}>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Get In Touch</h2>
                <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
              </div>
            </BlurFade>

            <BlurFade delay={BLUR_FADE_DELAY * 14}>
              <Card className="p-8 bg-white/50 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-0 text-center">
                  <p className="text-lg text-gray-700 mb-6">
                    I&apos;m always interested in new opportunities and collaborations.
                    Feel free to reach out if you&apos;d like to work together!
                  </p>

                  <div className="flex flex-wrap justify-center gap-4">
                    {profile.contact?.social?.map((social) => {
                      const IconComponent = Icons[social.icon as keyof typeof Icons] || Icons.globe;
                      return (
                        <Button
                          key={social.url}
                          variant="default"
                          size="lg"
                          asChild
                          className="gap-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-200 hover:scale-105"
                        >
                          <a href={social.url} target="_blank" rel="noreferrer">
                            <IconComponent className="size-5" />
                            {social.name}
                          </a>
                        </Button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </BlurFade>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
            <p className="text-sm mt-2">
              Built with ❤️ using Next.js and Tailwind CSS
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
