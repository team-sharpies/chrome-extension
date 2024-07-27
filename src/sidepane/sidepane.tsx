import React from 'react'
import { createRoot } from 'react-dom/client'

const Sidepane: React.FC = () => {
  const questions = [
    {
      id: 1,
      title: 'Question 1',
      description: 'This is the first question',
    },
    {
      id: 2,
      title: 'Question 2',
      description: 'This is the second question',
    },
  ]
  return (
    <div className="bg-neutral-800">
      <div>
        <div className="grid-col-1 grid gap-2.5 [&amp;_>_*]:min-w-0">
          <p className="whitespace-pre-wrap break-words">
            For learning and experimenting with native ARM assembly language on
            your M1 Mac, you have several good options. Each has its advantages,
            and the "best" choice often depends on personal preference and
            specific needs. Here's an overview of your options:
          </p>
          <ol className="-mt-1 list-decimal space-y-2 pl-8">
            <li className="whitespace-normal break-words">
              Xcode:
              <ul className="-mt-1 list-disc space-y-2 pl-8">
                <li className="whitespace-normal break-words">
                  Pros:
                  <ul className="-mt-1 list-disc space-y-2 pl-8">
                    <li className="whitespace-normal break-words">
                      Native macOS development environment
                    </li>
                    <li className="whitespace-normal break-words">
                      Excellent integration with macOS and iOS development
                    </li>
                    <li className="whitespace-normal break-words">
                      Built-in debugger and performance tools
                    </li>
                  </ul>
                </li>
                <li className="whitespace-normal break-words">
                  Cons:
                  <ul className="-mt-1 list-disc space-y-2 pl-8">
                    <li className="whitespace-normal break-words">
                      Can be heavy for just assembly programming
                    </li>
                    <li className="whitespace-normal break-words">
                      Primarily designed for higher-level languages
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
            <li className="whitespace-normal break-words">
              ARM Development Studio (DS-5):
              <ul className="-mt-1 list-disc space-y-2 pl-8">
                <li className="whitespace-normal break-words">
                  Pros:
                  <ul className="-mt-1 list-disc space-y-2 pl-8">
                    <li className="whitespace-normal break-words">
                      Specifically designed for ARM development
                    </li>
                    <li className="whitespace-normal break-words">
                      Comprehensive toolchain for ARM
                    </li>
                    <li className="whitespace-normal break-words">
                      Excellent debugging capabilities for ARM
                    </li>
                  </ul>
                </li>
                <li className="whitespace-normal break-words">
                  Cons:
                  <ul className="-mt-1 list-disc space-y-2 pl-8">
                    <li className="whitespace-normal break-words">
                      More complex setup
                    </li>
                    <li className="whitespace-normal break-words">
                      Primarily aimed at embedded systems development
                    </li>
                    <li className="whitespace-normal break-words">
                      May be overkill for simple assembly experiments
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
            <li className="whitespace-normal break-words">
              Visual Studio Code (VSCode):
              <ul className="-mt-1 list-disc space-y-2 pl-8">
                <li className="whitespace-normal break-words">
                  Pros:
                  <ul className="-mt-1 list-disc space-y-2 pl-8">
                    <li className="whitespace-normal break-words">
                      Lightweight and customizable
                    </li>
                    <li className="whitespace-normal break-words">
                      Many extensions available for assembly and ARM development
                    </li>
                    <li className="whitespace-normal break-words">
                      Can be integrated with external toolchains
                    </li>
                  </ul>
                </li>
                <li className="whitespace-normal break-words">
                  Cons:
                  <ul className="-mt-1 list-disc space-y-2 pl-8">
                    <li className="whitespace-normal break-words">
                      Requires some setup for optimal assembly development
                    </li>
                    <li className="whitespace-normal break-words">
                      Debugging might require additional configuration
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
          </ol>
          <p className="whitespace-pre-wrap break-words">
            For a beginner focusing on learning and experimentation, I would
            recommend starting with VSCode. Here's a suggested workflow:
          </p>
          <ol className="-mt-1 list-decimal space-y-2 pl-8">
            <li className="whitespace-normal break-words">
              Install VSCode from the official website.
            </li>
            <li className="whitespace-normal break-words">
              Install useful extensions:
              <ul className="-mt-1 list-disc space-y-2 pl-8">
                <li className="whitespace-normal break-words">
                  "ARM" by dan-c-underwood for ARM syntax highlighting
                </li>
                <li className="whitespace-normal break-words">
                  "ASM Code Lens" by maziac for assembly code navigation
                </li>
                <li className="whitespace-normal break-words">
                  "Native Debug" by WebFreak for debugging
                </li>
              </ul>
            </li>
            <li className="whitespace-normal break-words">
              Install the ARM GNU Toolchain for macOS (available from ARM's
              developer website).
            </li>
            <li className="whitespace-normal break-words">
              Set up your project:
              <ul className="-mt-1 list-disc space-y-2 pl-8">
                <li className="whitespace-normal break-words">
                  Create a new folder for your assembly projects
                </li>
                <li className="whitespace-normal break-words">
                  Create .s files for your assembly code
                </li>
              </ul>
            </li>
            <li className="whitespace-normal break-words">
              Use the terminal integrated in VSCode to assemble and link your
              code:
              <ul className="-mt-1 list-disc space-y-2 pl-8">
                <li className="whitespace-normal break-words">
                  To assemble:{' '}
                  <code className="bg-bg-300 text-accent-secondary-000 whitespace-pre-wrap rounded-[0.3rem] px-1 py-px text-[0.95em]">
                    as -o output.o input.s
                  </code>
                </li>
                <li className="whitespace-normal break-words">
                  To link:{' '}
                  <code className="bg-bg-300 text-accent-secondary-000 whitespace-pre-wrap rounded-[0.3rem] px-1 py-px text-[0.95em]">
                    ld -o output output.o
                  </code>
                </li>
                <li className="whitespace-normal break-words">
                  To run:{' '}
                  <code className="bg-bg-300 text-accent-secondary-000 whitespace-pre-wrap rounded-[0.3rem] px-1 py-px text-[0.95em]">
                    ./output
                  </code>
                </li>
              </ul>
            </li>
            <li className="whitespace-normal break-words">
              For debugging, you can use LLDB (comes with Xcode command line
              tools):
              <ul className="-mt-1 list-disc space-y-2 pl-8">
                <li className="whitespace-normal break-words">
                  In your assembly file, add debug symbols:{' '}
                  <code className="bg-bg-300 text-accent-secondary-000 whitespace-pre-wrap rounded-[0.3rem] px-1 py-px text-[0.95em]">
                    .global _start
                  </code>
                </li>
                <li className="whitespace-normal break-words">
                  Assemble with debug info:{' '}
                  <code className="bg-bg-300 text-accent-secondary-000 whitespace-pre-wrap rounded-[0.3rem] px-1 py-px text-[0.95em]">
                    as -g -o output.o input.s
                  </code>
                </li>
                <li className="whitespace-normal break-words">
                  Link as before
                </li>
                <li className="whitespace-normal break-words">
                  Start LLDB:{' '}
                  <code className="bg-bg-300 text-accent-secondary-000 whitespace-pre-wrap rounded-[0.3rem] px-1 py-px text-[0.95em]">
                    lldb output
                  </code>
                </li>
                <li className="whitespace-normal break-words">
                  Set breakpoints and run
                </li>
              </ul>
            </li>
          </ol>
          <p className="whitespace-pre-wrap break-words">
            This setup gives you a lightweight, flexible environment that's
            great for learning. As you progress, you might find Xcode or ARM
            Development Studio more suitable for larger projects or specific
            needs.
          </p>
          <p className="whitespace-pre-wrap break-words">
            Would you like me to provide a simple assembly example to get you
            started with this workflow?
          </p>
        </div>
      </div>
      <div className="list-none">
        {questions.map((question) => (
          <div key={question.id}>
            <a href="#" className="text-blue-500">
              {question.title}
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<Sidepane />)
