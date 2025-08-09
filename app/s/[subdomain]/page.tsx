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
    title: `${subdomain}.${rootDomain}`,
    description: `Subdomain page for ${subdomain}.${rootDomain}`
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



  return (
    // <div className="flex min-h-screen flex-col bg-gradient-to-b from-blue-50 to-white p-4">
    //   <div className="absolute top-4 right-4">
    //     <Link
    //       href={`${protocol}://${rootDomain}`}
    //       className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
    //     >
    //       {rootDomain}
    //     </Link>
    //   </div>

    //   <div className="flex-1 flex items-center justify-center">
    //     <div className="text-center">
    //       <div className="text-9xl mb-6">{subdomainData.name}</div>
    //       <h1 className="text-4xl font-bold tracking-tight text-gray-900">
    //         Welcome to {subdomain}.{rootDomain}
    //       </h1>
    //       <p className="mt-3 text-lg text-gray-600">
    //         This is your custom subdomain page
    //       </p>
    //     </div>
    //   </div>
    // </div>
    <>

      {profile && (
        <main className="flex flex-col min-h-[100dvh] space-y-10">

          <section id="hero">
            <div className="mx-auto w-full max-w-2xl space-y-8">
              <div className="gap-2 flex justify-between items-center">
                <div className="flex-col flex flex-1 space-y-1.5">
                  <BlurFadeText
                    delay={BLUR_FADE_DELAY}
                    className="text-3xl font-bold tracking-tighter sm:text-4xl xl:text-5xl/none"
                    yOffset={8}
                    text={`${profile.name.split(" ")[0]}`}
                  />
                  <BlurFadeText
                    className="max-w-[600px] md:text-md"
                    delay={BLUR_FADE_DELAY}
                    text={profile.description}
                  />
                </div>
                <BlurFade delay={BLUR_FADE_DELAY}>
                  <Avatar className="size-32 border">
                    <AvatarImage alt={profile.name} src={profile.avatar} />
                    <AvatarFallback>{profile.initials}</AvatarFallback>
                  </Avatar>
                </BlurFade>
              </div>
            </div>

          </section>
          <section id="about">
            <BlurFade delay={BLUR_FADE_DELAY * 3}>
              <h2 className="text-xl font-bold">About</h2>
            </BlurFade>
            <BlurFade delay={BLUR_FADE_DELAY * 4}>
              <Markdown components={{
                p: ({ children }) => <p className="max-w-full text-pretty text-sm">{children}</p>
              }}>
                {profile.summary}
              </Markdown>
              <div className="flex flex-wrap gap-4 mt-4 ">
                {profile.contact?.social?.map((social) => {
                  // Convert the icon string to a component
                  const IconComponent = Icons[social.icon as keyof typeof Icons] || Icons.globe;
                  return (
                    <div
                      key={social.url}
                      className="flex gap-1 justify-center items-center"
                    >
                      <IconComponent className="size-4" />
                      <a href={social.url} target="_blank" rel="noreferrer">
                        {social.name}
                      </a>
                    </div>
                  );
                })}
              </div>
            </BlurFade>
          </section>
          <section id="work">
            <div className="flex min-h-0 flex-col gap-y-3">
              <BlurFade delay={BLUR_FADE_DELAY * 5}>
                <h2 className="text-xl font-bold">Work Experience</h2>
              </BlurFade>
              {profile.works.map((work, id) => (
                <BlurFade
                  key={work.company}
                  delay={BLUR_FADE_DELAY * 6 + id * 0.05}
                >
                  <ResumeCard
                    key={work.company}
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
          </section>
          <section id="projects">
            <div className="space-y-4 w-full">
              <BlurFade delay={BLUR_FADE_DELAY * 11}>
                <h2 className="text-xl font-bold">Projects</h2>
              </BlurFade>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 max-w-[800px] mx-auto">
                {profile.projects.map((project, id) => (
                  <BlurFade
                    key={project.title}
                    delay={BLUR_FADE_DELAY * 12 + id * 0.05}
                  >
                    <ProjectCard
                      href={project.href}
                      key={project.title}
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
          <section id="skills">
            <div className="flex min-h-0 flex-col gap-y-3">
              <BlurFade delay={BLUR_FADE_DELAY * 9}>
                <h2 className="text-xl font-bold">Skills</h2>
              </BlurFade>
              <div className="flex flex-wrap gap-1">
                {profile.skills.map((skill, id) => (
                  <BlurFade key={skill} delay={BLUR_FADE_DELAY * 10 + id * 0.05}>
                    <Badge key={skill}>{skill}</Badge>
                  </BlurFade>
                ))}
              </div>
            </div>
          </section>

        </main>
      )
      }
    </>
  );
}
