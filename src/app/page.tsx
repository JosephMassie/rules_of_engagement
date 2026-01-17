import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { FaGithub } from 'react-icons/fa';

const githubLink = 'https://github.com/JosephMassie/rules_of_engagement';

export default function Home() {
    return (
        <>
            <div className="px-4">
                <h1 className="mb-12 text-4xl md:text-8xl font-decorative">
                    Rules of Engagement
                </h1>
                <div className="grid gap-y-4">
                    <p className="text-lg">
                        Welcome to Rules of Engagement or RoE, your open source
                        mission app for the tabletop wargame Infinity!
                    </p>
                    <p>
                        If you want to deploy your own version, contribute
                        directly, or make/request updates to any mission data
                        you can find the&nbsp;
                        <a
                            href={githubLink}
                            className="underline hover:text-accent hover:italic">
                            source code on Github
                        </a>
                        . There you can fork/clone to create your own version or
                        post issues and create pull requests.
                    </p>
                </div>
            </div>
            <div className="fixed left-0 bottom-0 w-full p-2 bg-accent flex justify-center items-center space-x-4">
                <Button
                    asChild
                    variant="outline"
                    className="block w-auto h-auto">
                    <a href="https://ko-fi.com/jmm370142">
                        <Image
                            src="/Sparkle mug.gif"
                            alt="kofi link"
                            width={300}
                            height={300}
                            className="block size-10"
                            unoptimized
                        />
                    </a>
                </Button>

                <Button asChild className="block w-auto h-auto">
                    <a href={githubLink}>
                        <FaGithub className="size-10" />
                    </a>
                </Button>
            </div>
        </>
    );
}
